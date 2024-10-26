import { serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { pgTable } from "./utils";

export const passwordResetToken = pgTable(
  "password_reset_token",
  {
    id: serial("id").primaryKey(),
    token: text("token").notNull(),
    email: text("email").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => ({
    passwordResetTokenUnique: unique().on(t.email, t.token),
  }),
);

export type PasswordResetToken = typeof passwordResetToken.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetToken.$inferInsert;
