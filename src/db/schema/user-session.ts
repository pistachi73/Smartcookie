import { text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";
import { pgTable } from "./utils";

export const userSession = pgTable(
  "user_session",
  {
    sessionToken: text().primaryKey(),
    userId: uuid()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  () => [],
);
