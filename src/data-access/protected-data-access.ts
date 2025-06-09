import { currentUser } from "@/shared/lib/auth";
import { PublicError } from "@/shared/services/errors";
import type { z } from "zod";

export function withAuthentication<TData, TResult>({
  callback,
}: {
  callback: (data: TData, userId: string) => Promise<TResult>;
}) {
  return async (data: TData): Promise<TResult> => {
    // Get authenticated user
    const authenticatedUser = await currentUser();

    // Verify authentication
    if (!authenticatedUser || !authenticatedUser.id) {
      throw new PublicError("Not authenticated");
    }

    // Call the original use case with authenticated userId
    return callback(data, authenticatedUser.id);
  };
}

/**
 * Wraps a use case function with Zod schema validation and authentication
 *
 * @example
 * // Define your schema and use case implementation
 * const mySchema = z.object({ ... });
 * const myUseCaseImpl = async (data: z.infer<typeof mySchema>, userId: string) => {
 *   // Your logic here
 * };
 *
 * // Export the validated and authenticated version
 * export const myUseCase = withValidationAndAuth(mySchema, myUseCaseImpl);
 */
export function withValidationAndAuth<TSchema extends z.ZodType, TResult>({
  schema,
  callback,
}: {
  schema: TSchema;
  callback: (data: z.infer<TSchema>, userId: string) => Promise<TResult>;
}) {
  return async (data: z.infer<TSchema>): Promise<TResult> => {
    const authenticatedUser = await currentUser();

    if (!authenticatedUser || !authenticatedUser.id) {
      throw new Error("Not authenticated");
    }

    const parseResult = schema.safeParse(data);

    if (!parseResult.success) {
      throw new Error("Validation failed", { cause: parseResult.error });
    }

    return callback(parseResult.data, authenticatedUser.id);
  };
}

export function withAuthenticationNoInput<TResult>({
  callback,
}: {
  callback: (userId: string) => Promise<TResult>;
}) {
  return async (): Promise<TResult> => {
    const authenticatedUser = await currentUser();

    if (!authenticatedUser || !authenticatedUser.id) {
      throw new PublicError("Not authenticated");
    }

    return callback(authenticatedUser.id);
  };
}

/**
 * Wraps a use case function with Zod schema validation only (no authentication)
 *
 * @example
 * const mySchema = z.object({ ... });
 * const myUseCaseImpl = async (data: z.infer<typeof mySchema>) => { ... };
 * export const myUseCase = withValidationOnly(mySchema, myUseCaseImpl);
 */
export function withValidationOnly<TSchema extends z.ZodType, TResult>({
  schema,
  callback,
}: {
  schema: TSchema;
  callback: (data: z.infer<TSchema>) => Promise<TResult>;
}) {
  return async (data: z.infer<TSchema>): Promise<TResult> => {
    const parseResult = schema.safeParse(data);
    if (!parseResult.success) {
      throw new Error("Validation failed", { cause: parseResult.error });
    }
    return callback(parseResult.data);
  };
}
