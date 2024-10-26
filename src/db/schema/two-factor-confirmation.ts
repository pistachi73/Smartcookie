import { index, serial, text, unique, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";
import { pgTable } from "./utils";

export const twoFactorConirmation = pgTable(
  "two_factor_confirmation",
  {
    id: serial("id").primaryKey(),
    token: text("token").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => ({
    tokenIdx: index().on(table.token),
    uniqueOnTokenUserId: unique().on(table.userId, table.token),
  }),
);
