import { relations } from "drizzle-orm";
import { jsonb, serial, timestamp } from "drizzle-orm/pg-core";
import { type EventOverrides, event } from "./event";
import { eventParticipant } from "./event-participant";
import { pgTable } from "./utils";

export const eventOccurrence = pgTable("event_occurrence", {
  id: serial("id").primaryKey(),
  eventId: serial("event_id")
    .notNull()
    .references(() => event.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time", { mode: "string" }).notNull(),
  endTime: timestamp("end_time", { mode: "string" }).notNull(),
  overrides: jsonb("overrides").$type<EventOverrides>(),
});

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

export type InsertEventOccurrence = typeof eventOccurrence.$inferInsert;
export type DBEventOccurence = typeof eventOccurrence.$inferSelect;
