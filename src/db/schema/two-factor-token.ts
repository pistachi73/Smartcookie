import { serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { pgTable } from "./utils";

export const twoFactorToken = pgTable(
  "two_factor_token",
  {
    id: serial().primaryKey(),
    token: text().notNull(),
    email: text().notNull(),
    expires: timestamp({ mode: "date" }).notNull(),
  },
  (t) => ({
    twoFactorTokensUnique: unique().on(t.email, t.token),
  }),
);
