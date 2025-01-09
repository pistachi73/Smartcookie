import { relations } from "drizzle-orm";
import { serial, timestamp } from "drizzle-orm/pg-core";
import { event } from "./event";
import { pgTable } from "./utils";

export const eventOccurrence = pgTable("event_occurrence", {
  id: serial("id").primaryKey(),
  eventId: serial("event_id")
    .notNull()
    .references(() => event.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time", { mode: "string" }).notNull(),
  endTime: timestamp("end_time", { mode: "string" }).notNull(),
});

export const eventOccurrenceRelations = relations(
  eventOccurrence,
  ({ one }) => ({
    event: one(event, {
      fields: [eventOccurrence.eventId],
      references: [event.id],
    }),
  }),
);

export type InsertEventOccurrence = typeof eventOccurrence.$inferInsert;
export type EventOccurrence = typeof eventOccurrence.$inferSelect;
