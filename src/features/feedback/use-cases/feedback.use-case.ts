"use server";

import { db } from "@/db";
import { questions } from "@/db/schema";
import { withValidationAndAuth } from "@/shared/lib/protected-use-case";
import { and, count, desc, eq, sql } from "drizzle-orm";
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

    // Get the questions with pagination and sorting using cached totalAnswers
    const [questionResults, totalCount] = await Promise.all([
      db
        .select({
          id: questions.id,
          title: questions.title,
          description: questions.description,
          type: questions.type,
          enableAdditionalComment: questions.enableAdditionalComment,
          updatedAt: questions.updatedAt,
          answerCount: questions.totalAnswers,
        })
        .from(questions)
        .where(whereCondition)
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .orderBy(
          sortBy === "alphabetical"
            ? desc(questions.title)
            : sortBy === "response-count"
              ? desc(questions.totalAnswers)
              : desc(questions.updatedAt),
        ),
      getCachedQuestionCount(userId, q),
    ]);

    console.log("questionResults", questionResults);

    return {
      questions: questionResults,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  },
});
