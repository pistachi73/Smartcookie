import { relations, sql } from "drizzle-orm";
import { boolean, index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { account } from "./account";
import { pgTable } from "./utils";

export const user = pgTable(
  "user",
  {
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    image: text("image"),
    emailVerified: timestamp("emailVerified", { mode: "date" }).defaultNow(),
    password: text("password"),
    salt: text("salt"),
    role: text("role", { enum: ["ADMIN", "USER"] }).default("USER"),
    isTwoFactorEnabled: boolean("is_two_factor_enabled").default(false),
  },
  (table) => ({
    emailIdx: index().on(table.email),
  }),
);

export const userRelations = relations(user, ({ one }) => ({
  account: one(account, {
    fields: [user.id],
    references: [account.userId],
  }),
}));

export type InsertUser = typeof user.$inferInsert;
export type User = typeof user.$inferSelect;
