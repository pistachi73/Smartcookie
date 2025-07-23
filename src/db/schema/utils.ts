import type { Column } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { pgTable as pgTableCreator } from "drizzle-orm/pg-core";

export const pgTable = pgTableCreator;

export const slugify = (column: Column) => sql`regexp_replace(
    regexp_replace(
      lower(${column}), -- Lowercase and remove accents in one step
      '[^a-z0-9\\-_]+', '-', 'gi' -- Replace non-alphanumeric characters with hyphens
    ),
    '(^-+|-+$)', '', 'g' -- Remove leading and trailing hyphens
  )`;
