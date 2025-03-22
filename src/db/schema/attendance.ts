import { relations } from "drizzle-orm";
import { boolean, serial } from "drizzle-orm/pg-core";
import { event } from "./event";
import { student } from "./student";
import { pgTable } from "./utils";

export const attendance = pgTable("attendance", {
  id: serial().primaryKey(),
  attendance: boolean().default(true),
  studentId: serial()
    .notNull()
    .references(() => student.id, { onDelete: "cascade" }),
  eventId: serial()
    .notNull()
    .references(() => event.id, { onDelete: "cascade" }),
});

export type InsertAttendance = typeof attendance.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(student, {
    fields: [attendance.studentId],
    references: [student.id],
  }),
  event: one(event, {
    fields: [attendance.eventId],
    references: [event.id],
  }),
}));
