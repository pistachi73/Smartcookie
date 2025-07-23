"use client";

import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ZodFormattedError, ZodType } from "zod";

import { useCurrentUser } from "./use-current-user";

/**
 * Extracts errors from a Zod formatted error object into simple strings
 */
function extractZodErrors(errors: Record<string, any>): string[] {
  const result: string[] = [];

  // Helper function for recursive extraction
  function extract(obj: any, path = "") {
    // If there are errors at this level, add them
    if (obj._errors?.length) {
      result.push(`${path}: ${obj._errors.join(", ")}`);
    }

    // Process nested errors
    for (const [key, value] of Object.entries(obj)) {
      if (key !== "_errors" && typeof value === "object" && value !== null) {
        const newPath = path ? `${path}.${key}` : key;
        extract(value, newPath);
      }
    }
  }

  extract(errors);
  return result;
}

// Error types
export class ValidationError<T = any> extends Error {
  constructor(
    message: string,
    public formattedErrors: ZodFormattedError<T, string>,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

/**
 * A fully self-contained protected mutation hook that checks auth state internally
 * and passes authenticated context to the mutation function
 */
export function useProtectedMutation<
  TInput,
  TOutput,
  TContext = unknown,
  TVariables = TInput,
  TError = Error | ValidationError<TInput> | AuthenticationError,
  TRequireAuth extends boolean = true,
>({
  schema,
  mutationFn,
  requireAuth = true as TRequireAuth,
  ...options
}: {
  schema: ZodType<TInput>;
  mutationFn: (
    input: TInput,
    authContext: TRequireAuth extends true
      ? { userId: string }
      : { userId: string | null },
  ) => Promise<TOutput>;
  requireAuth?: TRequireAuth;
} & Omit<
  UseMutationOptions<TOutput, TError, TVariables, TContext>,
  "mutationFn"
>): UseMutationResult<TOutput, TError, TVariables, TContext> {
  // Get auth state directly inside the hook
  const user = useCurrentUser();

  return useMutation<TOutput, TError, TVariables, TContext>({
    ...options,
    mutationFn: async (variables: TVariables) => {
      // First check authentication
      if (requireAuth && !user?.id) {
        throw new AuthenticationError() as unknown as TError;
      }

      // Then validate with Zod
      const parse = schema.safeParse(variables);

      if (!parse.success) {
        const formattedErrors = parse.error.format();
        throw new ValidationError<TInput>(
          "Validation failed",
          formattedErrors,
        ) as unknown as TError;
      }

      return await mutationFn(parse.data, {
        userId: requireAuth ? user!.id : (user?.id ?? null),
      } as TRequireAuth extends true
        ? { userId: string }
        : { userId: string | null });
    },

    onError: (error, variables, context) => {
      if (error instanceof AuthenticationError) {
        toast.error("You must be logged in to do this");
      }

      if (error instanceof ValidationError) {
        const errorMessages = extractZodErrors(error.formattedErrors);
        toast.error("Validation failed", {
          description: errorMessages?.join("\n"),
        });
      }

      // Call the original onError if provided
      options.onError?.(error, variables, context);
    },
  });
}
