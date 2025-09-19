import type { z } from "zod";

import { currentUser } from "@/shared/lib/auth";

import type { AuthUser } from "@/types/next-auth";
import { createDataAccessError, type DataAccessError } from "./errors";

interface ProtectedTryCatchOptions<TRequireAuth extends boolean = true> {
  /** Whether to enforce authentication. Default: true */
  requireAuth?: TRequireAuth;
  /** Custom error message for unexpected errors */
  unexpectedErrorMessage?: string;
  /** Custom error type for unexpected errors */
  unexpectedErrorType?: string;
  /** Whether to log the original error (useful for debugging) */
  logError?: boolean;
}

/**
 * Enhanced version that combines withProtectedDataAccess and withTryCatch
 * Provides authentication, validation, and error handling in one wrapper
 */
export function withProtectedTryCatch<
  TResult,
  TSchema extends z.ZodType | undefined = undefined,
  TRequireAuth extends boolean = true,
>({
  schema,
  callback,
  options = {},
}: {
  schema?: TSchema;
  callback: TSchema extends z.ZodType
    ? TRequireAuth extends true
      ? (data: z.infer<TSchema>, user: AuthUser) => Promise<TResult>
      : (data: z.infer<TSchema>, user: AuthUser | null) => Promise<TResult>
    : TRequireAuth extends true
      ? (user: AuthUser) => Promise<TResult>
      : (user: AuthUser | null) => Promise<TResult>;
  options?: ProtectedTryCatchOptions<TRequireAuth>;
}) {
  const {
    requireAuth = true as TRequireAuth,
    unexpectedErrorMessage = "Something went wrong",
    unexpectedErrorType = "UNEXPECTED_ERROR",
    logError = false,
  } = options;

  return async (
    ...args: TSchema extends z.ZodType ? [z.infer<TSchema>] : []
  ): Promise<TResult | DataAccessError<string>> => {
    try {
      // 1. Authentication
      const authenticatedUser = await currentUser();

      if (requireAuth && (!authenticatedUser || !authenticatedUser.id)) {
        return createDataAccessError({
          type: "AUTHENTICATION_ERROR",
          message: "You must be logged in to access this resource",
        });
      }

      // 2. Validation (if schema provided)
      let validatedData: any;
      if (schema && args.length > 0) {
        const parseResult = schema.safeParse(args[0]);
        if (!parseResult.success) {
          return createDataAccessError({
            type: "VALIDATION_ERROR",
            message: "Invalid input data",
            meta: { errors: parseResult.error.errors },
          });
        }
        validatedData = parseResult.data;
      }

      // 3. Execute callback with error handling
      if (schema && args.length > 0) {
        return await callback(validatedData, authenticatedUser as AuthUser);
      }
      return await (callback as any)(authenticatedUser);
    } catch (error) {
      if (logError) {
        console.error("withProtectedTryCatch caught error:", error);
      }

      return createDataAccessError({
        type: unexpectedErrorType,
        message: unexpectedErrorMessage,
      });
    }
  };
}
