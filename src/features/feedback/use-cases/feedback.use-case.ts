"use server";

import { db } from "@/db";
import { answers, questions } from "@/db/schema";
import { withValidationAndAuth } from "@/shared/lib/protected-use-case";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { cache } from "react";
import { GetQuestionsSchema } from "../lib/questions.schema";

const buildSearchCondition = (q?: string) => {
  if (!q || q.trim() === "") {
    return undefined;
  }
  const searchTerm = `%${q}%`;
  return sql`(${questions.title} ILIKE ${searchTerm} OR ${questions.description} ILIKE ${searchTerm})`;
};

// Cached function to get the total count of questions for a user
const getCachedQuestionCount = cache(async (userId: string, q?: string) => {
  const userCondition = eq(questions.userId, userId);
  const whereCondition =
    q && q.trim() !== ""
      ? and(userCondition, buildSearchCondition(q))
      : userCondition;

  const countResult = await db
    .select({ value: count() })
    .from(questions)
    .where(whereCondition);
  return countResult[0]?.value || 0;
});

export const getQuestionsUseCase = withValidationAndAuth({
  schema: GetQuestionsSchema,
  useCase: async ({ page, pageSize, sortBy, q }, userId) => {
    // Base condition for current user's questions
    const userCondition = eq(questions.userId, userId);
    const whereCondition =
      q && q.trim() !== ""
        ? and(userCondition, buildSearchCondition(q))
        : userCondition;

    // Get the questions with pagination and sorting
    const [questionResults, totalCount] = await Promise.all([
      db.query.questions.findMany({
        where: whereCondition,
        extras: {
          answerCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${answers} 
          WHERE ${answers.questionId} = ${questions.id}
        )`.as("answerCount"),
        },
        columns: {
          id: true,
          title: true,
          description: true,
          type: true,
          enableAdditionalComment: true,
          createdAt: true,
        },
        limit: pageSize,
        offset: (page - 1) * pageSize,
        orderBy:
          sortBy === "alphabetical"
            ? desc(questions.title)
            : sortBy === "response-count"
              ? asc(sql`"answerCount"`)
              : desc(questions.createdAt),
      }),
      getCachedQuestionCount(userId, q),
    ]);

    return {
      questions: questionResults,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  },
});
