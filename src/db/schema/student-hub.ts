import { relations } from "drizzle-orm";
import { index, serial, unique } from "drizzle-orm/pg-core";
import { hub } from "./hub";
import { student } from "./student";
import { pgTable } from "./utils";

export const studentHub = pgTable(
  "student_hub",
  {
    id: serial().primaryKey(),
    studentId: serial()
      .notNull()
      .references(() => student.id, { onDelete: "cascade" }),
    hubId: serial()
      .notNull()
      .references(() => hub.id, { onDelete: "cascade" }),
  },
  (t) => ({
    studentIdIdx: index().on(t.studentId),
    hubIdIdx: index().on(t.hubId),
    unq: unique().on(t.studentId, t.hubId),
  }),
);

export const studentHubRelations = relations(studentHub, ({ one }) => ({
  student: one(student, {
    fields: [studentHub.studentId],
    references: [student.id],
  }),
  hub: one(hub, {
    fields: [studentHub.hubId],
    references: [hub.id],
  }),
}));
