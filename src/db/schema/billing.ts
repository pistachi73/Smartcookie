import { boolean, integer, serial } from "drizzle-orm/pg-core";
import { client, paymentFrequencyEnum } from "./client";
import { hub } from "./hub";
import { pgTable } from "./utils";

export const billing = pgTable("billing", {
  id: serial().primaryKey(),
  clientId: serial()
    .notNull()
    .references(() => client.id, { onDelete: "cascade" }),
  hubId: serial()
    .notNull()
    .references(() => hub.id, { onDelete: "cascade" }),
  cost: integer().notNull(),
  billingType: paymentFrequencyEnum().notNull(),
  tentative: boolean().default(true),
  invoiceSent: boolean().default(false),
});

export type InsertBilling = typeof billing.$inferInsert;
export type Billing = typeof billing.$inferSelect;
