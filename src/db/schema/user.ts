import { relations, sql } from "drizzle-orm";
import { boolean, index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { account } from "./account";
import { pgTable } from "./utils";

export const user = pgTable(
  "user",
  {
    id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
    email: text().notNull(),
    name: text(),
    image: text(),
    emailVerified: timestamp({ mode: "date" }).defaultNow(),
    password: text(),
    salt: text(),
    role: text({ enum: ["ADMIN", "USER"] }).default("USER"),
    isTwoFactorEnabled: boolean().default(false),
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
