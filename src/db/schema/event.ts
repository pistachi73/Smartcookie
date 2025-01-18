import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { attendance } from "./attendance";
import { eventOccurrence } from "./event-occurrence";
import { hub } from "./hub";
import { user } from "./user";
import { pgTable } from "./utils";

export const event = pgTable("event", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  hubId: serial("hub_id")
    .notNull()
    .references(() => hub.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time", { mode: "string" }).notNull(),
  endTime: timestamp("end_time", { mode: "string" }).notNull(),
  price: integer("price").notNull(),
  isRecurring: boolean("is_recurring").default(false),
  recurrenceRule: text("recurrence_rule"),
  timezone: text("timezone").default("UTC").notNull(),
});

export const eventRelations = relations(event, ({ one, many }) => ({
  hub: one(hub, {
    fields: [event.hubId],
    references: [hub.id],
  }),
  occurrences: many(eventOccurrence),
  attendances: many(attendance),
}));

export type InsertEvent = typeof event.$inferInsert;
export type Event = typeof event.$inferSelect;

export type EventOverrides = {
  title: Event["title"];
  description: Event["description"];
  price: Event["price"];
  recurrenceRule: Event["recurrenceRule"];
  timezone: Event["timezone"];
};

export type EventOccurrence = Omit<Event, "id" | "startTime" | "endTime"> & {
  eventId: number;
  eventOccurrenceId: number;
  startTime: Date;
  endTime: Date;
};
