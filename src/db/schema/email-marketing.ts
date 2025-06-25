import { sql } from "drizzle-orm";
import { index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { pgTable } from "./utils";

export const emailMarketing = pgTable(
  "email_marketing",
  {
    id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
    email: text().notNull(),
    createdAt: timestamp({ mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index().on(table.email),
  }),
);

export type InsertEmailMarketing = typeof emailMarketing.$inferInsert;
export type EmailMarketing = typeof emailMarketing.$inferSelect;
