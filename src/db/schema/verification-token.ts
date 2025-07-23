import { serial, text, timestamp, unique } from "drizzle-orm/pg-core";

import { pgTable } from "./utils";

export const verificationToken = pgTable(
  "verification_token",
  {
    id: serial().primaryKey(),
    token: text().notNull(),
    email: text().notNull(),
    expires: timestamp({ mode: "date" }).notNull(),
  },
  (vt) => [unique().on(vt.email, vt.token)],
);

export type VerificationToken = typeof verificationToken.$inferSelect;
export type InsertVerificationToken = typeof verificationToken.$inferInsert;
