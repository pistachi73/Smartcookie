import { relations } from "drizzle-orm";
import { boolean, serial } from "drizzle-orm/pg-core";
import { client } from "./client";
import { session } from "./session";
import { pgTable } from "./utils";

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  attendance: boolean("attendance").default(true),
  clientId: serial("client_id")
    .notNull()
    .references(() => client.id, { onDelete: "cascade" }),
  sessionId: serial("session_id")
    .notNull()
    .references(() => session.id, { onDelete: "cascade" }),
});

export type InsertAttendance = typeof attendance.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;

export const attendanceRelations = relations(attendance, ({ one }) => ({
  client: one(client, {
    fields: [attendance.clientId],
    references: [client.id],
  }),
  session: one(session, {
    fields: [attendance.sessionId],
    references: [session.id],
  }),
}));
