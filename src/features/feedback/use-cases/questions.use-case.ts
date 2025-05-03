"use server";

import { db } from "@/db";
import { questions } from "@/db/schema";
import { withValidationAndAuth } from "@/shared/lib/protected-use-case";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import {
  DeleteQuestionFormSchema,
  UpdateQuestionFormSchema,
  newQuestionFormSchema,
} from "../lib/questions.schema";

export const getQuestionByIdUseCase = withValidationAndAuth({
  schema: z.object({
    id: z.number(),
  }),
  useCase: async ({ id }, userId) => {
    const question = await db.query.questions.findFirst({
      where: and(eq(questions.id, id), eq(questions.userId, userId)),
      columns: {
        id: true,
        title: true,
        description: true,
        type: true,
        enableAdditionalComment: true,
      },
      with: {
        answers: {
          columns: {
            id: true,
            value: true,
            additionalComment: true,
          },
          with: {
            surveyResponse: {
              columns: {},
              with: {
                student: {
                  columns: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!question) return null;

    return {
      ...question,
      answerCount: question.answers.length,
    };
  },
});

export const createQuestionUseCase = withValidationAndAuth({
  schema: newQuestionFormSchema,
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
