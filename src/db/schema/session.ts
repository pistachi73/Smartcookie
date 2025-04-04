import { relations } from "drizzle-orm";
import { integer, pgEnum, serial, timestamp, uuid } from "drizzle-orm/pg-core";
import { hub } from "./hub";
import { sessionNote } from "./session-note";
import { user } from "./user";
import { pgTable } from "./utils";

export const sessionStatusEnum = pgEnum("session_status", [
  "upcoming",
  "completed",
]);

export const session = pgTable("session", {
  id: serial().primaryKey(),
  hubId: integer()
    .notNull()
    .references(() => hub.id, { onDelete: "cascade" }),
  userId: uuid()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  startTime: timestamp({ mode: "string", withTimezone: true }).notNull(),
  endTime: timestamp({ mode: "string", withTimezone: true }).notNull(),
  status: sessionStatusEnum().default("upcoming").notNull(),
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: "string" })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export const sessionRelations = relations(session, ({ one, many }) => ({
  hub: one(hub, {
    fields: [session.hubId],
    references: [hub.id],
  }),
  creator: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
  notes: many(sessionNote),
}));

export type InsertSession = typeof session.$inferInsert;
export type Session = typeof session.$inferSelect;
export type SessionStatus = (typeof sessionStatusEnum.enumValues)[number];
