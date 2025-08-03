import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  serial,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { attendance } from "./attendance";
import { hub } from "./hub";
import { sessionNote } from "./session-note";
import { user } from "./user";
import { pgTable } from "./utils";

export const sessionStatusEnum = pgEnum("session_status", [
  "upcoming",
  "completed",
  "cancelled",
]);

export const session = pgTable(
  "session",
  {
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
  },
  (table) => [
    // Most important: covers WHERE hub_id = ? AND user_id = ? ORDER BY start_time
    index("session_hub_user_start_idx").on(
      table.hubId,
      table.userId,
      table.startTime,
    ),
    index("session_user_start_time_idx").on(table.userId, table.startTime),
  ],
);

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
  attendance: many(attendance),
}));

export type InsertSession = typeof session.$inferInsert;
export type Session = typeof session.$inferSelect;
export type SessionStatus = (typeof sessionStatusEnum.enumValues)[number];
