"use server";

import { db } from "@/db";
import {
  type InsertSurveyResponse,
  student,
  studentHub,
  surveyResponses,
  surveyTemplateQuestions,
  surveyTemplates,
  surveys,
} from "@/db/schema";
import {
  withAuthenticationNoInput,
  withValidationAndAuth,
} from "@/shared/lib/protected-use-case";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createHubSurveySchema } from "../lib/feedback.schema";

export const getHubSurveysUseCase = withValidationAndAuth({
  schema: z.object({
    hubId: z.number(),
  }),
  useCase: async ({ hubId }, userId) => {
    const feedback = await db.query.surveys.findMany({
      where: and(eq(surveys.hubId, hubId), eq(surveys.userId, userId)),
      columns: {
        createdAt: true,
        id: true,
      },
      with: {
        surveyTemplate: {
          columns: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    return feedback;
  },
});

export const getSurveyTemplatesUseCase = withAuthenticationNoInput({
  useCase: async (userId) => {
    const templates = await db.query.surveyTemplates.findMany({
      where: eq(surveyTemplates.userId, userId),
      columns: {
        id: true,
        title: true,
        description: true,
      },
      extras: {
        questionCount: sql<number>`(
          SELECT COUNT(*) FROM ${surveyTemplateQuestions}
          WHERE ${surveyTemplateQuestions.surveyTemplateId} = ${surveyTemplates.id}
        )`.as("questionCount"),
      },
    });
    return templates;
  },
});

export const createHubSurveyUseCase = withValidationAndAuth({
  schema: createHubSurveySchema,
  useCase: async ({ hubId, surveyTemplateId }, userId) => {
    await db.transaction(async (tx) => {
      const students = await tx
        .select({ id: student.id })
        .from(student)
        .leftJoin(studentHub, eq(student.id, studentHub.studentId))
        .where(and(eq(studentHub.hubId, hubId), eq(student.userId, userId)));

      if (students.length === 0) {
        throw new Error("No students found for this hub", {
          cause: "cause",
        });
      }

      const [survey] = await tx
        .insert(surveys)
        .values({
          hubId,
          userId,
          surveyTemplateId,
        })
        .returning({ id: surveys.id });

      if (!survey) {
        tx.rollback();
        return;
      }

      const toAddSurveyResponses: InsertSurveyResponse[] = students.map(
        (student) => ({
          surveyId: survey.id,
          studentId: student.id,
        }),
      );

      await tx.insert(surveyResponses).values(toAddSurveyResponses);
    });
  },
});
