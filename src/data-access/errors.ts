/**
 * Error object type
 */
export type DataAccessError<TKey extends string, TMeta = any> = {
  type: TKey;
  message: string;
  meta?: TMeta;
};

/**
 * Plan management specific error types
 */
export type PlanManagementError =
  | "INVALID_PLAN_TRANSITION"
  | "NOT_AN_UPGRADE"
  | "NOT_A_DOWNGRADE"
  | "UPGRADE_FAILED"
  | "DOWNGRADE_FAILED"
  | "ARCHIVE_FAILED"
  | "UNARCHIVE_FAILED"
  | "INVALID_RESOURCE_TYPE"
  | "UNAUTHORIZED"
  | "USER_NOT_FOUND";

/**
 * Type guard to check if a value is a DataAccessError
 */
export const isDataAccessError = <TKey extends string, TMeta = any>(
  value: unknown,
): value is DataAccessError<TKey, TMeta> => {
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
export const createDataAccessError = <TKey extends string, TMeta = any>({
  type,
  message,
  meta,
}: {
  type: TKey;
  message: string;
  meta?: TMeta;
}): DataAccessError<TKey, TMeta> => ({
  type,
  message,
  meta,
});
