import type { z } from "zod";

import { currentUser } from "@/shared/lib/auth";

import type { AuthUser } from "@/types/next-auth";
import {
  createDataAccessError,
  type DataAccessError,
  isDataAccessError,
} from "./errors";

// System error types that can be returned by the data access chain
type SystemErrorTypes = "AUTHENTICATION_ERROR" | "VALIDATION_ERROR";

// Removed unused interface - options are now inline

/**
 * Fluent API for building data access operations with chainable middleware
 */
export class DataAccessChain<
  TInput = void,
  TUser extends AuthUser | null = null,
  TMiddlewareErrors extends string = never,
  TUnexpectedError extends string = "UNEXPECTED_ERROR",
> {
  private _requireAuth = false;
  private _schema: z.ZodType | null = null;
  private _unexpectedErrorMessage = "Something went wrong";
  private _unexpectedErrorType = "UNEXPECTED_ERROR" as TUnexpectedError;
  private _logError = false;
  private _middleware: Array<
    (context: any) => Promise<void | DataAccessError<any>>
  > = [];

  /**
   * Require authentication for this operation
   */
  requireAuth(): DataAccessChain<
    TInput,
    TUser,
    TMiddlewareErrors,
    TUnexpectedError
  > {
    this._requireAuth = true;
    return this as any;
  }

  /**
   * Add input validation with Zod schema
   */
  input<TSchema extends z.ZodType>(
    schema: TSchema,
  ): DataAccessChain<
    z.infer<TSchema>,
    TUser,
    TMiddlewareErrors,
    TUnexpectedError
  > {
    this._schema = schema;
    return this as any;
  }

  /**
   * Configure error handling
   */
  onError<TNewUnexpectedError extends string = TUnexpectedError>(options: {
    message?: string;
    type?: TNewUnexpectedError;
    logError?: boolean;
  }): DataAccessChain<TInput, TUser, TMiddlewareErrors, TNewUnexpectedError> {
    if (options.message) this._unexpectedErrorMessage = options.message;
    if (options.type) this._unexpectedErrorType = options.type as any;
    if (options.logError !== undefined) this._logError = options.logError;
    return this as any;
  }

  /**
   * Add custom middleware to the chain
   */
  use<TNewErrors extends string>(
    middleware: (context: {
      data: TInput;
      user: TUser;
      metadata: Record<string, any>;
    }) => Promise<void | DataAccessError<TNewErrors>>,
  ): DataAccessChain<
    TInput,
    TUser,
    TMiddlewareErrors | TNewErrors,
    TUnexpectedError
  > {
    this._middleware.push(middleware);
    return this;
  }

  /**
   * Add rate limiting (conceptual - would need actual implementation)
   */
  rateLimit(_options: {
    requests: number;
    window: number; // in seconds
    keyGenerator?: (user: TUser, data: TInput) => string;
  }): DataAccessChain<TInput, TUser, TMiddlewareErrors, TUnexpectedError> {
    return this.use(async () => {
      // Rate limiting logic would go here
      // This is just a placeholder to show the concept
    });
  }

  /**
   * Execute the operation with all configured middleware
   */
  execute<TResult>(
    callback: TInput extends void
      ? TUser extends AuthUser
        ? (user: AuthUser) => Promise<TResult>
        : (user: AuthUser | null) => Promise<TResult>
      : TUser extends AuthUser
        ? (data: TInput, user: AuthUser) => Promise<TResult>
        : (data: TInput, user: AuthUser | null) => Promise<TResult>,
  ) {
    return async (
      ...args: TInput extends void ? [] : [TInput]
    ): Promise<
      | TResult
      | DataAccessError<TMiddlewareErrors | TUnexpectedError | SystemErrorTypes>
    > => {
      try {
        // 1. Authentication
        const authenticatedUser = await currentUser();

        if (
          this._requireAuth &&
          (!authenticatedUser || !authenticatedUser.id)
        ) {
          return createDataAccessError({
            type: "AUTHENTICATION_ERROR",
            message: "You must be logged in to access this resource",
          });
        }

        // 2. Validation
        let validatedData: any;
        if (this._schema && args.length > 0) {
          const parseResult = this._schema.safeParse(args[0]);
          if (!parseResult.success) {
            return createDataAccessError({
              type: "VALIDATION_ERROR",
              message: "Invalid input data",
              meta: { errors: parseResult.error.errors },
            });
          }
          validatedData = parseResult.data;
        }

        // 3. Run middleware
        const context = {
          data: validatedData || (args[0] as TInput),
          user: authenticatedUser as TUser,
          metadata: {},
        };

        for (const middleware of this._middleware) {
          const result = await middleware(context);
          if (isDataAccessError(result)) {
            return result as DataAccessError<TMiddlewareErrors>;
          }
        }

        // 4. Execute callback
        if (this._schema && args.length > 0) {
          return await callback(validatedData, authenticatedUser as any);
        }
        return await (callback as any)(authenticatedUser);
      } catch (error) {
        if (this._logError) {
          console.error("DataAccessChain caught error:", error);
        }

        return createDataAccessError({
          type: this._unexpectedErrorType,
          message: this._unexpectedErrorMessage,
        }) as DataAccessError<TUnexpectedError>;
      }
    };
  }
}

/**
 * Start building a data access operation chain
 */
export const dataAccess = () => new DataAccessChain();

/**
 * Convenience method for authenticated operations
 */
export const authenticatedDataAccess = () =>
  new DataAccessChain<void, AuthUser>().requireAuth();

/**
 * Convenience method for operations with input validation
 */
export const inputDataAccess = <TSchema extends z.ZodType>(schema: TSchema) =>
  new DataAccessChain().input(schema);

/**
 * Convenience method for authenticated + input validation operations
 */
export const protectedDataAccess = <TSchema extends z.ZodType>(
  schema: TSchema,
) => new DataAccessChain<void, AuthUser>().requireAuth().input(schema);
