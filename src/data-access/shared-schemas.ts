import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { NeonQueryResultHKT } from "drizzle-orm/neon-serverless";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { z } from "zod";

import type * as schema from "@/db/schema";

// Type for main database instance
export type DrizzleDB = ReturnType<
  typeof import("drizzle-orm/neon-serverless").drizzle<typeof schema>
>;

// Type for Drizzle transaction
export type DrizzleTransaction = PgTransaction<
  NeonQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

// Union type for both database and transaction
export type DatabaseExecutor = DrizzleDB | DrizzleTransaction;

// Custom Zod type for database transaction or main db instance
export const DatabaseTransactionSchema = z
  .custom<DatabaseExecutor>((val) => {
    // Basic validation - check if it has the expected database methods
    return (
      val &&
      typeof val === "object" &&
      "select" in val &&
      "insert" in val &&
      "update" in val &&
      "delete" in val
    );
  }, "Invalid database executor object")
  .optional();

/**
 * Factory function to create a column selection schema for any Drizzle table
 */
export function createColumnSelectionSchema<
  T extends { $inferSelect: Record<string, any> },
>(table: T) {
  type SelectType = T["$inferSelect"];
  const columnKeys = Object.keys(table) as Array<keyof SelectType>;
  return z
    .object(
      columnKeys.reduce(
        (acc, key) => {
          acc[key] = z.literal(true);
          return acc;
        },
        {} as Record<keyof SelectType, z.ZodLiteral<true>>,
      ),
    )
    .partial();
}
