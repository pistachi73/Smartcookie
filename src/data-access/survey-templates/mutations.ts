"use server";

import { db } from "@/db";
import {
  type InsertSurveyTemplateQuestion,
  surveyTemplateQuestions,
  surveyTemplates,
} from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { withValidationAndAuth } from "../protected-data-access";
import {
  CreateSurveyTemplateSchema,
  DeleteSurveyTemplateSchema,
  UpdateSurveyTemplateSchema,
} from "./schemas";

export const createSurveyTemplate = withValidationAndAuth({
  schema: CreateSurveyTemplateSchema,
  callback: async ({ title, description, questions }, user) => {
    await db.transaction(async (tx) => {
      const [surveyTemplate] = await tx
        .insert(surveyTemplates)
        .values({
          title,
          description,
          userId: user.id,
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

export const updateSurveyTemplate = withValidationAndAuth({
  schema: UpdateSurveyTemplateSchema,
  callback: async (
    { id: surveyTemplateId, title, description, questions },
    user,
  ) => {
    await db.transaction(async (tx) => {
      // Update survey template basic info
      await tx
        .update(surveyTemplates)
        .set({
          title,
          description,
        })
        .where(
          and(
            eq(surveyTemplates.id, surveyTemplateId),
            eq(surveyTemplates.userId, user.id),
          ),
        );

      // Get existing survey template questions
      const existingSurveyTemplateQuestions = await tx
        .select({
          id: surveyTemplateQuestions.id,
          questionId: surveyTemplateQuestions.questionId,
          order: surveyTemplateQuestions.order,
          required: surveyTemplateQuestions.required,
        })
        .from(surveyTemplateQuestions)
        .where(eq(surveyTemplateQuestions.surveyTemplateId, surveyTemplateId));

      const existingQuestionIds = existingSurveyTemplateQuestions.map(
        (q) => q.questionId,
      );
      const newQuestionIds = questions.map((q) => q.id);

      // Find questions to remove
      const questionsToRemove = existingSurveyTemplateQuestions.filter(
        (eq) => !newQuestionIds.includes(eq.questionId),
      );

      // Find questions to update
      const surveyTemplateQuestionsToUpdate = questions
        .map((q) => {
          const existing = existingSurveyTemplateQuestions.find(
            (eq) => eq.questionId === q.id,
          );
          const hasChanged =
            existing?.required !== q.required || existing?.order !== q.order;

          return existing && hasChanged
            ? { ...q, surveyTemplateQuestionId: existing.id }
            : null;
        })
        .filter((q): q is NonNullable<typeof q> => q !== null);

      const surveyTemplateQuestionsToInsert: InsertSurveyTemplateQuestion[] =
        questions
          .filter((q) => !existingQuestionIds.includes(q.id))
          .map((question) => ({
            surveyTemplateId,
            questionId: question.id,
            order: question.order,
            required: question.required,
          }));

      // Execute all operations concurrently
      await Promise.all([
        // Remove questions
        questionsToRemove.length > 0
          ? tx.delete(surveyTemplateQuestions).where(
              inArray(
                surveyTemplateQuestions.id,
                questionsToRemove.map((q) => q.id),
              ),
            )
          : undefined,

        // Add new questions
        surveyTemplateQuestionsToInsert.length > 0
          ? tx
              .insert(surveyTemplateQuestions)
              .values(surveyTemplateQuestionsToInsert)
          : undefined,

        // Update existing questions
        ...surveyTemplateQuestionsToUpdate.map((question) =>
          tx
            .update(surveyTemplateQuestions)
            .set({
              required: question.required,
              order: question.order,
            })
            .where(
              eq(surveyTemplateQuestions.id, question.surveyTemplateQuestionId),
            ),
        ),
      ]);
    });
  },
});

export const deleteSurveyTemplate = withValidationAndAuth({
  schema: DeleteSurveyTemplateSchema,
  callback: async ({ id }, user) => {
    await db
      .delete(surveyTemplates)
      .where(
        and(eq(surveyTemplates.id, id), eq(surveyTemplates.userId, user.id)),
      );
  },
});
