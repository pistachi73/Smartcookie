import { relations } from "drizzle-orm";
import { boolean, index, primaryKey, serial } from "drizzle-orm/pg-core";

import { eventOccurrence } from "./event-occurrence";
import { student } from "./student";
import { pgTable } from "./utils";

export const eventParticipant = pgTable(
  "event_participant",
  {
    eventOccurrenceId: serial()
      .notNull()
      .references(() => eventOccurrence.id, { onDelete: "cascade" }),
    participantId: serial()
      .notNull()
      .references(() => student.id, { onDelete: "cascade" }),
    attended: boolean().default(false),
  },
  (t) => [
    primaryKey({
      name: "composite_key",
      columns: [t.participantId, t.eventOccurrenceId],
    }),
    index().on(t.participantId),
    index().on(t.eventOccurrenceId),
  ],
);

export const eventParticipantRelations = relations(
  eventParticipant,
  ({ one }) => ({
    eventOccurrence: one(eventOccurrence, {
      fields: [eventParticipant.eventOccurrenceId],
      references: [eventOccurrence.id],
    }),
    participant: one(student, {
      fields: [eventParticipant.participantId],
      references: [student.id],
    }),
  }),
);

export type InsertEventParticipant = typeof eventParticipant.$inferInsert;
export type EventParticipant = typeof eventParticipant.$inferSelect;
