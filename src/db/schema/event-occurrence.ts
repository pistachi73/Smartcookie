import { relations } from "drizzle-orm";
import { integer, jsonb, serial, timestamp } from "drizzle-orm/pg-core";

import { type EventOverrides, event } from "./event";
import { eventParticipant } from "./event-participant";
import { pgTable } from "./utils";

export const eventOccurrence = pgTable(
  "event_occurrence",
  {
    id: serial().primaryKey(),
    eventId: integer()
      .references(() => event.id, { onDelete: "cascade" })
      .notNull(),
    startTime: timestamp({ mode: "string", withTimezone: true }).notNull(),
    endTime: timestamp({ mode: "string", withTimezone: true }).notNull(),
    overrides: jsonb().$type<EventOverrides>(),
  },
  () => [],
);

export const eventOccurrenceRelations = relations(
  eventOccurrence,
  ({ one, many }) => ({
    event: one(event, {
      fields: [eventOccurrence.eventId],
      references: [event.id],
    }),
    participants: many(eventParticipant),
  }),
);

export type InsertOccurrence = typeof eventOccurrence.$inferInsert;
export type Occurrence = typeof eventOccurrence.$inferSelect;
