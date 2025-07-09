import { relations, sql } from "drizzle-orm";
import { index, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { hub } from "./hub";
import { surveyResponses } from "./survey-responses";
import { surveyTemplates } from "./survey-templates";
import { user } from "./user";
import { pgTable } from "./utils";

export const surveys = pgTable(
  "survey",
  {
    id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
    userId: uuid()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    hubId: integer()
      .references(() => hub.id, { onDelete: "cascade" })
      .notNull(),
    surveyTemplateId: integer()
      .references(() => surveyTemplates.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp({ mode: "string", withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index().on(t.userId),
    index().on(t.surveyTemplateId),
    index().on(t.hubId),
  ],
);

export const surveysRelations = relations(surveys, ({ one, many }) => ({
  hub: one(hub, {
    fields: [surveys.hubId],
    references: [hub.id],
  }),
  surveyTemplate: one(surveyTemplates, {
    fields: [surveys.surveyTemplateId],
    references: [surveyTemplates.id],
  }),
  surveyResponses: many(surveyResponses),
}));

export type InsertSurvey = typeof surveys.$inferInsert;
export type Survey = typeof surveys.$inferSelect;
