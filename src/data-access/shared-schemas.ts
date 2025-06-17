import type * as schema from "@/db/schema";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { NeonQueryResultHKT } from "drizzle-orm/neon-serverless";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { z } from "zod";

// Type for Drizzle transaction
export type DrizzleTransaction = PgTransaction<
  NeonQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

// Custom Zod type for database transaction
export const DatabaseTransactionSchema = z
  .custom<DrizzleTransaction>((val) => {
    // Basic validation - check if it has the expected database methods
    return (
      val &&
      typeof val === "object" &&
      "select" in val &&
      "insert" in val &&
      "update" in val &&
      "delete" in val &&
      "transaction" in val
    );
  }, "Invalid database transaction object")
  .optional();
