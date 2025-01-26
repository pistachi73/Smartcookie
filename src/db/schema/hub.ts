import { relations } from "drizzle-orm";
import { integer, pgEnum, serial, text, uuid } from "drizzle-orm/pg-core";
import { clientHub } from "./client-hub";
import { event } from "./event";
import { user } from "./user";
import { pgTable } from "./utils";

export const scheduleTypeEnum = pgEnum("schedule_type", [
  "on-demand",
  "recurrent",
]);

export const hub = pgTable("hub", {
  id: serial().primaryKey(),
  userId: uuid()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  name: text().notNull(),
  description: text().notNull(),
  scheduleType: scheduleTypeEnum().notNull(),
  defaultSessionPrice: integer().notNull(),
  cancelationPolicyHours: integer().notNull(),
});

export type InsertHub = typeof hub.$inferInsert;
export type Hub = typeof hub.$inferSelect;

export const hubRelations = relations(hub, ({ many }) => ({
  clients: many(clientHub),
  sessions: many(event),
}));
