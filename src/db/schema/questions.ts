import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { answers } from "./answers";
import { surveyTemplateQuestions } from "./survey-template-questions";
import { user } from "./user";
import { pgTable } from "./utils";

export const questionTypeEnum = pgEnum("question_type", [
  "text",
  "rating",
  "boolean",
]);

export const questions = pgTable(
  "questions",
  {
    id: serial().primaryKey(),
    userId: uuid()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    title: text().notNull(),
    description: text(),
    type: questionTypeEnum().notNull().default("text"),
    enableAdditionalComment: boolean().notNull().default(false),
    totalAnswers: integer().notNull().default(0),
    createdAt: timestamp({ mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ mode: "string", withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (t) => ({
    userIdIdx: index().on(t.userId),
    searchIdx: index("search_idx").using(
      "gin",
      sql`to_tsvector('english', coalesce(${t.title}, '') || ' ' || coalesce(${t.description}, ''))`,
    ),
  }),
);

export const questionsRelations = relations(questions, ({ many }) => ({
  surveyTemplateQuestions: many(surveyTemplateQuestions),
  answers: many(answers),
}));

export type InsertQuestion = typeof questions.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type QuestionType = (typeof questionTypeEnum.enumValues)[number];
