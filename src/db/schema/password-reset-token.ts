import { serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { pgTable } from "./utils";

export const passwordResetToken = pgTable(
  "password_reset_token",
  {
    id: serial().primaryKey(),
    token: text().notNull(),
    email: text().notNull(),
    expires: timestamp({ mode: "date" }).notNull(),
  },
  (t) => [unique().on(t.email, t.token)],
);

export type PasswordResetToken = typeof passwordResetToken.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetToken.$inferInsert;
