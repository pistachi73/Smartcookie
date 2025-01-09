import { relations } from "drizzle-orm";
import { boolean, serial } from "drizzle-orm/pg-core";
import { client } from "./client";
import { event } from "./event";
import { pgTable } from "./utils";

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  attendance: boolean("attendance").default(true),
  clientId: serial("client_id")
    .notNull()
    .references(() => client.id, { onDelete: "cascade" }),
  eventId: serial("event_id")
    .notNull()
    .references(() => event.id, { onDelete: "cascade" }),
});

export type InsertAttendance = typeof attendance.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;

export const attendanceRelations = relations(attendance, ({ one }) => ({
  client: one(client, {
    fields: [attendance.clientId],
    references: [client.id],
  }),
  event: one(event, {
    fields: [attendance.eventId],
    references: [event.id],
  }),
}));
