"use server";

import { db } from "@/db";
import { questions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { withValidationAndAuth } from "../protected-data-access";
import {
  CreateQuestionSchema,
  DeleteQuestionSchema,
  UpdateQuestionSchema,
} from "./schemas";

export const createQuestion = withValidationAndAuth({
  schema: CreateQuestionSchema,
  callback: async (
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

export const deleteQuestion = withValidationAndAuth({
  schema: DeleteQuestionSchema,
  callback: async ({ id }, userId) => {
    await db
      .delete(questions)
      .where(and(eq(questions.id, id), eq(questions.userId, userId)));
  },
});

export const updateQuestion = withValidationAndAuth({
  schema: UpdateQuestionSchema,
  callback: async (data, userId) => {
    await db
      .update(questions)
      .set(data)
      .where(and(eq(questions.id, data.id), eq(questions.userId, userId)));
  },
});
