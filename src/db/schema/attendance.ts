import { relations } from "drizzle-orm";
import { integer, pgEnum, serial, timestamp } from "drizzle-orm/pg-core";
import { session } from "./session";
import { student } from "./student";
import { pgTable } from "./utils";

export const attendanceStatusEnum = pgEnum("attendance_status", [
  "present",
  "absent",
]);

export const attendance = pgTable("attendance", {
  id: serial().primaryKey(),
  studentId: integer()
    .notNull()
    .references(() => student.id, { onDelete: "cascade" }),
  sessionId: integer()
    .notNull()
    .references(() => session.id, { onDelete: "cascade" }),
  status: attendanceStatusEnum().default("present").notNull(),
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: "string" })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(student, {
    fields: [attendance.studentId],
    references: [student.id],
  }),
  session: one(session, {
    fields: [attendance.sessionId],
    references: [session.id],
  }),
}));

export type InsertAttendance = typeof attendance.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;
export type AttendanceStatus = (typeof attendanceStatusEnum.enumValues)[number];
