"use server";

import { PublicError } from "@/shared/services/errors";
import type { z } from "zod";
import { currentUser } from "./auth";

/**
 * Wraps a use case function with authentication and userId verification
 * Ensures the authenticated user matches the requested userId
 *
 * @example
 * // Define your use case implementation
 * const myUseCaseImpl = async (data: { userId: string, ... }) => {
 *   // Your logic here
 * };
 *
 * // Export the protected version
 * export const myUseCase = withUserVerification(myUseCaseImpl);
 */
export function withUserVerification<TData extends { userId: string }, TResult>(
  useCase: (data: TData) => Promise<TResult>,
) {
  return async (data: TData): Promise<TResult> => {
    // Get authenticated user from session
    const authenticatedUser = await currentUser();

    // Verify authentication and user ID match
    if (!authenticatedUser || !authenticatedUser.id) {
      throw new Error("Not authenticated");
    }

    if (authenticatedUser.id !== data.userId) {
      throw new Error("Unauthorized: User ID mismatch");
    }

    // Call the original use case with the data
    return useCase(data);
  };
}

/**
 * Wraps a use case function with authentication check
 * and automatically provides the authenticated userId
 *
 * @example
 * // Define your use case implementation
 * const myUseCaseImpl = async (data: MyDataType, userId: string) => {
 *   // Your logic here that uses userId
 * };
 *
 * // Export the authenticated version that doesn't need userId in parameters
 * export const myUseCase = withAuthentication(myUseCaseImpl);
 */
export function withAuthentication<TData, TResult>(
  useCase: (data: TData, userId: string) => Promise<TResult>,
) {
  return async (data: TData): Promise<TResult> => {
    // Get authenticated user
    const authenticatedUser = await currentUser();

    // Verify authentication
    if (!authenticatedUser || !authenticatedUser.id) {
      throw new PublicError("Not authenticated");
    }

    // Call the original use case with authenticated userId
    return useCase(data, authenticatedUser.id);
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
export function withValidationAndAuth<TSchema extends z.ZodType, TResult>(
  schema: TSchema,
  useCase: (data: z.infer<TSchema>, userId: string) => Promise<TResult>,
) {
  return async (data: unknown): Promise<TResult> => {
    // Get authenticated user
    const authenticatedUser = await currentUser();

    // Verify authentication
    if (!authenticatedUser || !authenticatedUser.id) {
      throw new Error("Not authenticated");
    }

    // Validate with Zod
    const parseResult = schema.safeParse(data);

    if (!parseResult.success) {
      throw new Error("Validation failed", { cause: parseResult.error });
    }

    // Call the original use case with validated data and authenticated userId
    return useCase(parseResult.data, authenticatedUser.id);
  };
}
