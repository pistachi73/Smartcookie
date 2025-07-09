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

export const event = pgTable(
  "event",
  {
    id: serial().primaryKey(),
    hubId: integer().references(() => hub.id, { onDelete: "cascade" }),
    userId: uuid()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text().notNull(),
    description: text(),
    startTime: timestamp({ mode: "string", withTimezone: true }).notNull(),
    endTime: timestamp({ mode: "string", withTimezone: true }).notNull(),
    price: integer(),
    isRecurring: boolean().default(false),
    recurrenceRule: text(),
    timezone: text().default("UTC").notNull(),
    color: text().default("blue").notNull(),
  },
  () => [],
);

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

export type EventOverrides = Partial<{
  title: Event["title"];
  description: Event["description"];
  price: Event["price"];
  recurrenceRule: Event["recurrenceRule"];
  timezone: Event["timezone"];
  color: Event["color"];
}>;

export type EventOccurrence = Omit<
  Event,
  "id" | "startTime" | "endTime" | "userId"
> & {
  eventId: number;
  eventOccurrenceId: number;
  startTime: Date;
  endTime: Date;
  userId?: string;
};
