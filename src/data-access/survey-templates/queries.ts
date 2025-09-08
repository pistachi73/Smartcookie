"use server";

import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { cache } from "react";
import { z } from "zod";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { surveyTemplateQuestions, surveyTemplates } from "@/db/schema";
import { GetSurveyTemplatesSchema } from "./schemas";

const buildSearchCondition = (q?: string) => {
  if (!q || q.trim() === "") {
    return undefined;
  }

  const searchTerm = `%${q}%`;
  return sql`(${surveyTemplates.title} ILIKE ${searchTerm} OR ${surveyTemplates.description} ILIKE ${searchTerm})`;
};

// Cached function to get the total count of questions for a user
const getCachedSurveyTemplatesCount = cache(
  async (userId: string, q?: string) => {
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
  },
);

export const getSurveyTemplates = withProtectedDataAccess({
  schema: GetSurveyTemplatesSchema,
  callback: async ({ page, pageSize, sortBy, q }, user) => {
    const userCondition = eq(surveyTemplates.userId, user.id);
    const whereCondition =
      q && q.trim() !== ""
        ? and(userCondition, buildSearchCondition(q))
        : userCondition;

    const [surveyTemplatesResult, totalCount] = await Promise.all([
      db
        .select({
          id: surveyTemplates.id,
          title: surveyTemplates.title,
          description: surveyTemplates.description,
          updatedAt: surveyTemplates.updatedAt,
          totalResponses: surveyTemplates.totalResponses,
        })
        .from(surveyTemplates)
        .where(whereCondition)
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .orderBy(
          sortBy === "alphabetical"
            ? asc(surveyTemplates.title)
            : sortBy === "newest"
              ? desc(surveyTemplates.updatedAt)
              : desc(surveyTemplates.totalResponses),
        ),
      getCachedSurveyTemplatesCount(user.id, q),
    ]);

    return {
      surveyTemplates: surveyTemplatesResult,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  },
});

export const getSurveyTemplateById = withProtectedDataAccess({
  schema: z.object({
    id: z.number(),
  }),
  callback: async ({ id }, user) => {
    const surveyTemplate = await db.query.surveyTemplates.findFirst({
      where: and(
        eq(surveyTemplates.id, id),
        eq(surveyTemplates.userId, user.id),
      ),
      columns: {
        id: true,
        title: true,
        description: true,
        totalResponses: true,
        averageResponseTime: true,
        updatedAt: true,
      },
      with: {
        surveyTemplateQuestions: {
          columns: {
            id: true,
            required: true,
            order: true,
          },
          orderBy: [asc(surveyTemplateQuestions.order)],
          with: {
            question: {
              columns: {
                id: true,
                title: true,
                description: true,
                type: true,
                enableAdditionalComment: true,
              },
            },
          },
        },
      },
    });

    if (!surveyTemplate) {
      return null;
    }

    const questions = surveyTemplate.surveyTemplateQuestions.map((stq) => ({
      ...stq.question,
      required: stq.required,
      order: stq.order,
      surveyTemplateQuestionId: stq.id,
    }));

    return {
      id: surveyTemplate.id,
      title: surveyTemplate.title,
      description: surveyTemplate.description,
      totalResponses: surveyTemplate.totalResponses,
      averageResponseTime: surveyTemplate.averageResponseTime,
      updatedAt: surveyTemplate.updatedAt,
      questions,
    };
  },
});
