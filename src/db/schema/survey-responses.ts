import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  serial,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { student } from "./student";
import { surveys } from "./surveys";
import { pgTable } from "./utils";

export const surveyResponses = pgTable(
  "survey_responses",
  {
    id: serial().primaryKey(),
    surveyId: uuid()
      .references(() => surveys.id, { onDelete: "cascade" })
      .notNull(),
    studentId: integer()
      .references(() => student.id, { onDelete: "cascade" })
      .notNull(),
    completed: boolean().default(false),
    completedAt: timestamp({ mode: "string", withTimezone: true }),
  },
  (t) => ({
    surveyIdIdx: index().on(t.surveyId),
    studentIdIdx: index().on(t.studentId),
  }),
);

export const surveyResponsesRelations = relations(
  surveyResponses,
  ({ one }) => ({
    survey: one(surveys, {
      fields: [surveyResponses.surveyId],
      references: [surveys.id],
    }),
    student: one(student, {
      fields: [surveyResponses.studentId],
      references: [student.id],
    }),
  }),
);

export type InsertSurveyResponse = typeof surveyResponses.$inferInsert;
export type SurveyResponse = typeof surveyResponses.$inferSelect;
