import { relations } from "drizzle-orm";
import { index, integer, serial, text, timestamp } from "drizzle-orm/pg-core";
import { questions } from "./questions";
import { surveyResponses } from "./survey-responses";
import { pgTable } from "./utils";

export const answers = pgTable(
  "answers",
  {
    id: serial().primaryKey(),
    questionId: integer()
      .references(() => questions.id, {
        onDelete: "cascade",
      })
      .notNull(),
    surveyResponseId: integer()
      .references(() => surveyResponses.id, {
        onDelete: "cascade",
      })
      .notNull(),
    value: text().notNull(),
    additionalComment: text(),
    answeredAt: timestamp({ mode: "string", withTimezone: true }).defaultNow(),
  },
  (t) => [index().on(t.questionId), index().on(t.surveyResponseId)],
);

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
  surveyResponse: one(surveyResponses, {
    fields: [answers.surveyResponseId],
    references: [surveyResponses.id],
  }),
}));

export type InsertAnswer = typeof answers.$inferInsert;
export type Answer = typeof answers.$inferSelect;
