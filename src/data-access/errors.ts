/**
 * Error object type
 */
export type DataAccessError<TMeta = any> = {
  type: string;
  message: string;
  meta?: TMeta;
};

/**
 * Type guard to check if a value is a DataAccessError
 */
export const isDataAccessError = <TMeta = any>(
  value: unknown,
): value is DataAccessError<TMeta> => {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "message" in value &&
    typeof (value as any).type === "string" &&
    typeof (value as any).message === "string"
  );
};

/**
 * Creates a DataAccessError with optional custom message
 * Perfect for use with neverthrow's err() function
 */
export const createDataAccessError = <TMeta = any>({
  type,
  message,
  meta,
}: {
  type: string;
  message: string;
  meta?: TMeta;
}): DataAccessError<TMeta> => ({
  type,
  message,
  meta,
});
