import { boolean, integer, serial } from "drizzle-orm/pg-core";

import { hub } from "./hub";
import { student } from "./student";
import { pgTable } from "./utils";

export const billing = pgTable(
  "billing",
  {
    id: serial().primaryKey(),
    studentId: serial()
      .notNull()
      .references(() => student.id, { onDelete: "cascade" }),
    hubId: serial()
      .notNull()
      .references(() => hub.id, { onDelete: "cascade" }),
    cost: integer().notNull(),
    tentative: boolean().default(true),
    invoiceSent: boolean().default(false),
  },
  (_table) => [],
);

export type InsertBilling = typeof billing.$inferInsert;
export type Billing = typeof billing.$inferSelect;
