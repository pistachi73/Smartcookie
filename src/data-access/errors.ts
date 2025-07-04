/**
 * Centralized error definitions for data access layer
 */

/**
 * Error types as const assertion for string literals
 */
export const ERROR_TYPES = {
  DUPLICATE_RESOURCE: "DUPLICATE_RESOURCE",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  INVALID_LOGIN: "INVALID_LOGIN",
  EMAIL_SENDING_FAILED: "EMAIL_SENDING_FAILED",
  DATABASE_ERROR: "DATABASE_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
  NOT_FOUND: "NOT_FOUND",
} as const;

/**
 * Extract error type as union of string literals
 */
export type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

/**
 * Error messages mapping
 */
const ERROR_MESSAGES: Record<ErrorType, string> = {
  DUPLICATE_RESOURCE: "Resource already exists",
  INVALID_TOKEN: "Invalid or malformed token",
  TOKEN_EXPIRED: "Token has expired",
  INVALID_LOGIN: "Invalid username or password",
  EMAIL_SENDING_FAILED: "Email sending failed",
  DATABASE_ERROR: "Database operation failed",
  VALIDATION_ERROR: "Invalid input data",
  AUTHENTICATION_ERROR: "Not authenticated",
  UNEXPECTED_ERROR: "An unexpected error occurred",
  NOT_FOUND: "Resource not found",
};

/**
 * Error object type
 */
export type DataAccessError<T extends ErrorType> = {
  type: T;
  message: string;
};

/**
 * Helper to get error message by type
 */
export const getErrorMessage = (type: ErrorType): string =>
  ERROR_MESSAGES[type];

/**
 * Helper to check if a string is a valid error type
 */
export const isValidErrorType = (type: string): type is ErrorType => {
  return Object.values(ERROR_TYPES).includes(type as ErrorType);
};

/**
 * Type guard to check if a value is a DataAccessError
 */
export const isDataAccessError = <T extends ErrorType>(
  value: unknown,
): value is DataAccessError<T> => {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "message" in value &&
    typeof (value as any).type === "string" &&
    typeof (value as any).message === "string" &&
    isValidErrorType((value as any).type)
  );
};

/**
 * Creates a DataAccessError with optional custom message
 * Perfect for use with neverthrow's err() function
 */
export const createDataAccessError = <T extends ErrorType>(
  type: T,
  customMessage?: string,
): DataAccessError<T> => ({
  type,
  message: customMessage || ERROR_MESSAGES[type],
});
