import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { session } from "./session";
import { user } from "./user";
import { pgTable } from "./utils";

// Define an enum for note positions (past, present, future)
export const sessionNotePositionEnum = pgEnum("session_note_position", [
  "past",
  "present",
  "future",
]);

export const sessionNote = pgTable("session_note", {
  id: serial().primaryKey(),
  sessionId: integer()
    .notNull()
    .references(() => session.id, { onDelete: "cascade" }),
  userId: uuid()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  position: sessionNotePositionEnum("position").default("present").notNull(),
  content: text().notNull(),
  updatedAt: timestamp({ mode: "string" })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export const sessionNoteRelations = relations(sessionNote, ({ one }) => ({
  session: one(session, {
    fields: [sessionNote.sessionId],
    references: [session.id],
  }),
  author: one(user, {
    fields: [sessionNote.userId],
    references: [user.id],
  }),
}));

export type InsertSessionNote = typeof sessionNote.$inferInsert;
export type SessionNote = typeof sessionNote.$inferSelect;
export type SessionNotePosition =
  (typeof sessionNotePositionEnum.enumValues)[number];
