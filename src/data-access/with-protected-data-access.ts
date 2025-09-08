import type { z } from "zod";

import { currentUser } from "@/shared/lib/auth";

import type { AuthUser } from "@/types/next-auth";
import { createDataAccessError } from "./errors";

interface ProtectedDataAccessOptions<TRequireAuth extends boolean = true> {
  /** Whether to enforce authentication. Default: true */
  requireAuth?: TRequireAuth;
}

export function withProtectedDataAccess<
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
  options?: ProtectedDataAccessOptions<TRequireAuth>;
}) {
  const { requireAuth = true as TRequireAuth } = options;

  return async (
    ...args: TSchema extends z.ZodType ? [z.infer<TSchema>] : []
  ): Promise<TResult> => {
    // 1. Authentication
    const authenticatedUser = await currentUser();

    if (requireAuth && (!authenticatedUser || !authenticatedUser.id)) {
      return createDataAccessError({
        type: "AUTHENTICATION_ERROR",
        message: "You must be logged in to access this resource",
      }) as TResult;
    }

    // 3. Validation (if schema provided and validation enabled)
    let validatedData: any;
    if (schema && args.length > 0) {
      const parseResult = schema.safeParse(args[0]);
      if (!parseResult.success) {
        return createDataAccessError({
          type: "VALIDATION_ERROR",
          message: "Invalid input data",
        }) as TResult;
      }
      validatedData = parseResult.data;
    }

    // 4. Execute callback
    if (schema && args.length > 0) {
      return callback(validatedData, authenticatedUser as AuthUser);
    }
    return (callback as any)(authenticatedUser);
  };
}
