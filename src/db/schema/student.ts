import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { attendance } from "./attendance";
import { studentHub } from "./student-hub";
import { surveyResponses } from "./survey-responses";
import { user } from "./user";
import { pgTable } from "./utils";

export const studentStatusEnum = pgEnum("student_status", [
  "active",
  "inactive",
]);

export const student = pgTable(
  "student",
  {
    id: serial().primaryKey(),
    userId: uuid()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    name: text().notNull(),
    email: text().notNull(),
    phone: text(),
    location: text(),
    nationality: text(),
    job: text(),
    status: studentStatusEnum().default("active"),
    birthDate: timestamp({ mode: "string", withTimezone: true }),
    motherLanguage: text(),
    learningLanguage: text(),
    image: text(),
    interests: text(),
    age: integer(),
  },
  (table) => ({
    nameIdx: index().on(table.name),
    emailIdx: index().on(table.email),
    searchIdx: index("student_search_idx").using(
      "gin",
      sql`to_tsvector('english', ${table.name} || ' ' || ${table.email})`,
    ),
  }),
);

export type InsertStudent = typeof student.$inferInsert;
export type Student = typeof student.$inferSelect;

export const studentRelations = relations(student, ({ many }) => ({
  studentHub: many(studentHub),
  attendances: many(attendance),
  surveyResponses: many(surveyResponses),
}));
