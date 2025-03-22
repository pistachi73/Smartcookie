import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { clientHub } from "./client-hub";
import { event } from "./event";
import { quickNote } from "./quick-note";
import { user } from "./user";
import { pgTable } from "./utils";

export const hubStatusEnum = pgEnum("hub_status", ["active", "inactive"]);

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

export const hub = pgTable(
  "hub",
  {
    id: serial().primaryKey(),
    userId: uuid()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    name: text().notNull(),
    description: text().notNull(),
    schedule: text().notNull(),
    status: hubStatusEnum("status").default("active").notNull(),
    color: customColorEnum("color").default("neutral").notNull(),
    level: varchar({ length: 255 }).notNull(),
    startDate: timestamp({ mode: "string" }).notNull(),
    endDate: timestamp({ mode: "string" }).notNull(),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "string" })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (t) => ({
    userIdIdx: index("user_id_idx").on(t.userId),
  }),
);

export type InsertHub = typeof hub.$inferInsert;
export type Hub = typeof hub.$inferSelect;

export const hubRelations = relations(hub, ({ many }) => ({
  clients: many(clientHub),
  sessions: many(event),
  quickNotes: many(quickNote),
}));
