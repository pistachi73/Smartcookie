import { boolean, integer, serial } from "drizzle-orm/pg-core";
import { client, paymentFrequencyEnum } from "./client";
import { hub } from "./hub";
import { pgTable } from "./utils";

export const billing = pgTable("billing", {
  id: serial("id").primaryKey(),
  clientId: serial("clientId")
    .notNull()
    .references(() => client.id, { onDelete: "cascade" }),
  hubId: serial("hubId")
    .notNull()
    .references(() => hub.id, { onDelete: "cascade" }),
  cost: integer("cost").notNull(),
  billingType: paymentFrequencyEnum().notNull(),
  tentative: boolean("tentative").default(true),
  invoiceSent: boolean("invoice_sent").default(false),
});

export type InsertBilling = typeof billing.$inferInsert;
export type Billing = typeof billing.$inferSelect;
