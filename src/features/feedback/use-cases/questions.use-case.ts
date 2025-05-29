"use server";

import { db } from "@/db";
import { questions } from "@/db/schema";
import { withValidationAndAuth } from "@/shared/lib/protected-use-case";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import {
  DeleteQuestionFormSchema,
  QuestionFormSchema,
  UpdateQuestionFormSchema,
} from "../lib/questions.schema";

export const getQuestionByIdUseCase = withValidationAndAuth({
  schema: z.object({
    id: z.number(),
  }),
  useCase: async ({ id }, userId) => {
    // Get question basic info only
    const question = await db.query.questions.findFirst({
      where: and(eq(questions.id, id), eq(questions.userId, userId)),
      columns: {
        id: true,
        title: true,
        description: true,
        type: true,
        enableAdditionalComment: true,
        totalAnswers: true,
      },
    });

    if (!question) return null;

    return question;
  },
});

export const getQuestionAnswersUseCase = withValidationAndAuth({
  schema: z.object({
    id: z.number(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
  }),
  useCase: async ({ id, dateFrom, dateTo }, userId) => {
    // Default to 2 months from today if no date range provided
    const defaultDateFrom = new Date();
    defaultDateFrom.setMonth(defaultDateFrom.getMonth() - 2);

    const effectiveDateFrom = dateFrom || defaultDateFrom;
    const effectiveDateTo = dateTo || new Date();

    // Verify question belongs to user first
    const question = await db.query.questions.findFirst({
      where: and(eq(questions.id, id), eq(questions.userId, userId)),
      columns: { id: true },
    });

    if (!question) return null;

    // Get only the answers with date filtering
    const questionWithAnswers = await db.query.questions.findFirst({
      where: eq(questions.id, id),
      columns: { id: true },
      with: {
        answers: {
          where: (answers, { and, gte, lte }) =>
            and(
              gte(answers.answeredAt, effectiveDateFrom.toISOString()),
              lte(answers.answeredAt, effectiveDateTo.toISOString()),
            ),
          columns: {
            id: true,
            value: true,
            additionalComment: true,
          },
          orderBy: (answers, { desc }) => [desc(answers.answeredAt)],
        },
      },
    });

    return questionWithAnswers?.answers || [];
  },
});

export const createQuestionUseCase = withValidationAndAuth({
  schema: QuestionFormSchema,
  useCase: async (
    { title, description, enableAdditionalComment, questionType },
    userId,
  ) => {
    const question = await db
      .insert(questions)
      .values({
        title,
        description,
        type: questionType,
        enableAdditionalComment,
        userId,
      })
      .returning();

    return question;
  },
});

export const deleteQuestionUseCase = withValidationAndAuth({
  schema: DeleteQuestionFormSchema,
  useCase: async ({ id }, userId) => {
    await db
      .delete(questions)
      .where(and(eq(questions.id, id), eq(questions.userId, userId)));
  },
});

export const updateQuestionUseCase = withValidationAndAuth({
  schema: UpdateQuestionFormSchema,
  useCase: async (data, userId) => {
    await db
      .update(questions)
      .set(data)
      .where(and(eq(questions.id, data.id), eq(questions.userId, userId)));
  },
});
