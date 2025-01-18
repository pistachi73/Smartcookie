import { relations } from "drizzle-orm";
import { boolean, index, primaryKey, serial } from "drizzle-orm/pg-core";
import { client } from "./client";
import { eventOccurrence } from "./event-occurrence";
import { pgTable } from "./utils";

export const eventParticipant = pgTable(
  "event_participant",
  {
    eventOccurrenceId: serial("event_occurrence_id")
      .notNull()
      .references(() => eventOccurrence.id, { onDelete: "cascade" }),
    participantId: serial("participant_id")
      .notNull()
      .references(() => client.id, { onDelete: "cascade" }),
    attended: boolean("attended").default(false),
  },
  (t) => ({
    cpk: primaryKey({
      name: "composite_key",
      columns: [t.participantId, t.eventOccurrenceId],
    }),
    participantIdx: index().on(t.participantId),
    eventOccurrenceIdx: index().on(t.eventOccurrenceId),
  }),
);

export const eventParticipantRelations = relations(
  eventParticipant,
  ({ one }) => ({
    eventOccurrence: one(eventOccurrence, {
      fields: [eventParticipant.eventOccurrenceId],
      references: [eventOccurrence.id],
    }),
    participant: one(client, {
      fields: [eventParticipant.participantId],
      references: [client.id],
    }),
  }),
);

export type InsertEventParticipant = typeof eventParticipant.$inferInsert;
export type EventParticipant = typeof eventParticipant.$inferSelect;
