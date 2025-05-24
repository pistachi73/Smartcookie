"use server";

import { db } from "@/db";
import {
  type InsertSurveyTemplateQuestion,
  surveyResponses,
  surveyTemplateQuestions,
  surveyTemplates,
  surveys as surveysTable,
} from "@/db/schema";
import { withValidationAndAuth } from "@/shared/lib/protected-use-case";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { cache } from "react";
import { CreateSurveySchema, GetSurveysSchema } from "../lib/surveys.schema";

const buildSearchCondition = (q?: string) => {
  if (!q || q.trim() === "") {
    return undefined;
  }
  const searchTerm = `%${q}%`;
  return sql`(${surveyTemplates.title} ILIKE ${searchTerm} OR ${surveyTemplates.description} ILIKE ${searchTerm})`;
};

// Cached function to get the total count of questions for a user
const getCachedSurveysCount = cache(async (userId: string, q?: string) => {
  const userCondition = eq(surveyTemplates.userId, userId);
  const whereCondition =
    q && q.trim() !== ""
      ? and(userCondition, buildSearchCondition(q))
      : userCondition;

  const countResult = await db
    .select({ value: count() })
    .from(surveyTemplates)
    .where(whereCondition);
  return countResult[0]?.value || 0;
});

export const getSurveysUseCase = withValidationAndAuth({
  schema: GetSurveysSchema,
  useCase: async ({ page, pageSize, sortBy, q }, userId) => {
    const userCondition = eq(surveyTemplates.userId, userId);
    const whereCondition =
      q && q.trim() !== ""
        ? and(userCondition, buildSearchCondition(q))
        : userCondition;

    const [surveys, totalCount] = await Promise.all([
      db
        .select({
          id: surveyTemplates.id,
          title: surveyTemplates.title,
          description: surveyTemplates.description,
          updatedAt: surveyTemplates.updatedAt,
          responsesCount: count(surveyResponses.id).as("responsesCount"),
        })
        .from(surveyTemplates)
        .leftJoin(
          surveysTable,
          eq(surveysTable.surveyTemplateId, surveyTemplates.id),
        )
        .leftJoin(
          surveyResponses,
          and(
            eq(surveyResponses.surveyId, surveysTable.id),
            eq(surveyResponses.completed, true),
          ),
        )
        .where(whereCondition)
        .groupBy(
          surveyTemplates.id,
          surveyTemplates.title,
          surveyTemplates.description,
          surveyTemplates.updatedAt,
        )
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .orderBy(
          sortBy === "alphabetical"
            ? asc(surveyTemplates.title)
            : sortBy === "newest"
              ? desc(surveyTemplates.updatedAt)
              : desc(sql`"responsesCount"`),
        ),
      getCachedSurveysCount(userId, q),
    ]);

    return {
      surveys,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  },
});

export const createSurveyUseCase = withValidationAndAuth({
  schema: CreateSurveySchema,
  useCase: async ({ title, description, questions }, userId) => {
    await db.transaction(async (tx) => {
      const [surveyTemplate] = await tx
        .insert(surveyTemplates)
        .values({
          title,
          description,
          userId,
        })
        .returning({ id: surveyTemplates.id });

      if (!surveyTemplate) {
        tx.rollback();
        return;
      }

      const toInsertQuestions: InsertSurveyTemplateQuestion[] = questions.map(
        (question, index) => ({
          surveyTemplateId: surveyTemplate.id,
          questionId: question.id,
          order: index + 1,
          required: question.required,
        }),
      );

      await tx.insert(surveyTemplateQuestions).values(toInsertQuestions);
    });
  },
});
