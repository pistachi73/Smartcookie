import { serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { pgTable } from "./utils";

export const twoFactorToken = pgTable(
  "two_factor_token",
  {
    id: serial("id").primaryKey(),
    token: text("token").notNull(),
    email: text("email").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => ({
    twoFactorTokensUnique: unique().on(t.email, t.token),
  }),
);
