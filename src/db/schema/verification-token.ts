import { serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { pgTable } from "./utils";

export const verificationToken = pgTable(
  "verification_token",
  {
    id: serial("id").primaryKey(),
    token: text("token").notNull(),
    email: text("email").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    unique: unique().on(vt.email, vt.token),
  }),
);
