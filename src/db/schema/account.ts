import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import { integer, primaryKey, text, uuid } from "drizzle-orm/pg-core";

import { user } from "./user";
import { pgTable } from "./utils";

export const account = pgTable(
  "account",
  {
    userId: uuid()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text().$type<AdapterAccount["type"]>().notNull(),
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    refresh_token: text(),
    access_token: text(),
    expires_at: integer(),
    token_type: text(),
    scope: text(),
    id_token: text(),
    session_state: text(),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ],
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export type Account = typeof account.$inferSelect;
export type InsertAccount = typeof account.$inferInsert;
