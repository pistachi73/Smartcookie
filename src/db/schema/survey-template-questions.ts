import { relations } from "drizzle-orm";
import { boolean, index, integer, serial } from "drizzle-orm/pg-core";
import { questions } from "./questions";
import { surveyTemplates } from "./survey-templates";
import { pgTable } from "./utils";

export const surveyTemplateQuestions = pgTable(
  "survey_template_questions",
  {
    id: serial().primaryKey(),
    surveyTemplateId: integer()
      .references(() => surveyTemplates.id, {
        onDelete: "cascade",
      })
      .notNull(),
    questionId: integer()
      .references(() => questions.id)
      .notNull(),
    required: boolean().notNull().default(true),
    order: integer().notNull(),
  },
  (t) => ({
    surveyTemplateIdIdx: index().on(t.surveyTemplateId),
    questionIdIdx: index().on(t.questionId),
  }),
);

export const surveyTemplateQuestionsRelations = relations(
  surveyTemplateQuestions,
  ({ one }) => ({
    surveyTemplate: one(surveyTemplates, {
      fields: [surveyTemplateQuestions.surveyTemplateId],
      references: [surveyTemplates.id],
    }),
    question: one(questions, {
      fields: [surveyTemplateQuestions.questionId],
      references: [questions.id],
    }),
  }),
);

export type InsertSurveyTemplateQuestion =
  typeof surveyTemplateQuestions.$inferInsert;
export type SurveyTemplateQuestion =
  typeof surveyTemplateQuestions.$inferSelect;
