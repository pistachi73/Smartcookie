import { db } from "@/db";
import { sql } from "drizzle-orm";
import { cache } from "react";

export type PgTimezone = {
  name: string;
  offset: string;
  displayoffset: string;
  displayname: string;
};

export const getPgTimezones = cache(async () => {
  const data = await db.execute<PgTimezone>(sql`
        SELECT 
          name,
          utc_offset as offset,
          'UTC' || CASE WHEN length(utc_offset::text)<9 THEN '+' ELSE '' END || substring(utc_offset::text, 1, length(utc_offset::text) - 3) as displayOffset,
          REPLACE(REPLACE(name, '/', ' - '), '_', ' ') as displayName
        FROM pg_timezone_names
        WHERE name NOT LIKE 'Etc%'
          AND name NOT LIKE 'GMT%'
          AND length(name::text) > 3
        ORDER BY utc_offset`);

  return data.rows;
});
