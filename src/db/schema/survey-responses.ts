import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  serial,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { answers } from "./answers";
import { student } from "./student";
import { surveys } from "./surveys";
import { pgTable } from "./utils";

export const surveyResponseStatus = pgEnum("survey_response_status", [
  "active", // The student is currently in the hub
  "archived", // The student is no longer in the hub
  "deleted", // Soft deleted (hide but not delete permanently)
]);

export const surveyResponses = pgTable(
  "survey_responses",
  {
    id: serial().primaryKey(),
    surveyId: uuid().references(() => surveys.id, { onDelete: "set null" }),
    studentId: integer()
      .references(() => student.id, { onDelete: "cascade" })
      .notNull(),
    completed: boolean().default(false),
    status: surveyResponseStatus().notNull().default("active"),
    createdAt: timestamp({ mode: "string", withTimezone: true }).defaultNow(),
    startedAt: timestamp({ mode: "string", withTimezone: true }),
    completedAt: timestamp({ mode: "string", withTimezone: true }),
  },
  (t) => [index().on(t.surveyId), index().on(t.studentId)],
);

export const surveyResponsesRelations = relations(
  surveyResponses,
  ({ one, many }) => ({
    survey: one(surveys, {
      fields: [surveyResponses.surveyId],
      references: [surveys.id],
    }),
    student: one(student, {
      fields: [surveyResponses.studentId],
      references: [student.id],
    }),
    answers: many(answers),
  }),
);

export type InsertSurveyResponse = typeof surveyResponses.$inferInsert;
export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type SurveyResponseStatus =
  (typeof surveyResponseStatus.enumValues)[number];
