import { relations } from "drizzle-orm";
import { integer, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { surveyTemplateQuestions } from "./survey-template-questions";
import { surveys } from "./surveys";
import { user } from "./user";
import { pgTable } from "./utils";

export const surveyTemplates = pgTable("survey_templates", {
  id: serial().primaryKey(),
  userId: uuid()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  title: text().notNull(),
  description: text(),
  totalResponses: integer().default(0),
  averageResponseTime: integer().default(0),
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: "string" })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export const surveyTemplatesRelations = relations(
  surveyTemplates,
  ({ many }) => ({
    surveyTemplateQuestions: many(surveyTemplateQuestions),
    surveys: many(surveys),
  }),
);

export type InsertSurveyTemplate = typeof surveyTemplates.$inferInsert;
export type SurveyTemplate = typeof surveyTemplates.$inferSelect;
