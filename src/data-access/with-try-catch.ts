import { createDataAccessError, type DataAccessError } from "./errors";

interface TryCatchOptions {
  /** Custom error message for unexpected errors */
  errorMessage?: string;
  /** Custom error type for unexpected errors */
  errorType?: string;
  /** Additional metadata to include in error */
  errorMeta?: any;
  /** Whether to log the original error (useful for debugging) */
  logError?: boolean;
}

/**
 * Wraps an async function with try-catch error handling
 * Returns either the successful result or a DataAccessError
 */
export const withTryCatch = async <T>(
  fn: () => Promise<T>,
  options: TryCatchOptions = {},
): Promise<T | DataAccessError<string>> => {
  const {
    errorMessage = "Something went wrong",
    errorType = "UNEXPECTED_ERROR",
    errorMeta,
    logError = false,
  } = options;

  try {
    return await fn();
  } catch (error) {
    if (logError) {
      console.error("withTryCatch caught error:", error);
    }

    return createDataAccessError({
      type: errorType,
      message: errorMessage,
      meta: errorMeta,
    });
  }
};
