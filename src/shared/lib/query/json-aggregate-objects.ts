import type { SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

/**
 * Creates a SQL expression for JSON aggregation with COALESCE to handle empty results
 * @param columns Object mapping output property names to table columns
 * @param filterColumn Optional column to use in the FILTER clause (defaults to the first column)
 * @returns SQL expression that can be used in queries
 */
export function jsonAggregateObjects<TReturn extends Record<string, unknown>[]>(
  columns: Record<string, PgColumn>,
  filterColumn?: PgColumn,
): SQL<TReturn> {
  // Build array of key-value pairs for json_build_object
  const entries = Object.entries(columns).flatMap(([key, column]) => [
    sql.raw(`'${key}'`),
    column,
  ]);

  // Use the first column as the filter column if none provided
  const columnToFilter = filterColumn || Object.values(columns)[0];

  return sql<TReturn>`
    COALESCE(
      json_agg(
        json_build_object(${sql.join(entries, sql`, `)})
      ) FILTER (WHERE ${columnToFilter} IS NOT NULL),
      '[]'
    )
  `;
}
