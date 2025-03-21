import { relations } from "drizzle-orm";
import { integer, pgEnum, serial, text, uuid } from "drizzle-orm/pg-core";
import { clientHub } from "./client-hub";
import { event } from "./event";
import { quickNote } from "./quick-note";
import { user } from "./user";
import { pgTable } from "./utils";

export const scheduleTypeEnum = pgEnum("schedule_type", [
  "on-demand",
  "recurrent",
]);

export const customColorEnum = pgEnum("custom_color", [
  "flamingo",
  "tangerine",
  "banana",
  "sage",
  "peacock",
  "blueberry",
  "lavender",
  "grape",
  "graphite",
  "neutral",
  "sunshine",
  "stone",
  "slate",
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
  color: customColorEnum("color").default("neutral").notNull(),
});

export type InsertHub = typeof hub.$inferInsert;
export type Hub = typeof hub.$inferSelect;

export const hubRelations = relations(hub, ({ many }) => ({
  clients: many(clientHub),
  sessions: many(event),
  quickNotes: many(quickNote),
}));
