"use server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  withAuthenticationNoInput,
  withValidationAndAuth,
} from "@/shared/lib/protected-use-case";

import { db } from "@/db";
import {
  type InsertSurveyResponse,
  student,
  studentHub,
  surveyResponses,
  surveys,
  surveyTemplateQuestions,
  surveyTemplates,
} from "@/db/schema";
import { createHubSurveySchema } from "../lib/feedback.schema";

export const getHubSurveysUseCase = withValidationAndAuth({
  schema: z.object({
    hubId: z.number(),
  }),
  useCase: async ({ hubId }, user) => {
    const feedback = await db.query.surveys.findMany({
      where: and(eq(surveys.hubId, hubId), eq(surveys.userId, user.id)),
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
  useCase: async (user) => {
    const templates = await db
      .select({
        id: surveyTemplates.id,
        title: surveyTemplates.title,
        description: surveyTemplates.description,
        questionCount: sql<number>`COUNT(${surveyTemplateQuestions.id})`.as(
          "questionCount",
        ),
      })
      .from(surveyTemplates)
      .leftJoin(
        surveyTemplateQuestions,
        eq(surveyTemplates.id, surveyTemplateQuestions.surveyTemplateId),
      )
      .where(eq(surveyTemplates.userId, user.id))
      .groupBy(
        surveyTemplates.id,
        surveyTemplates.title,
        surveyTemplates.description,
      );

    return templates;
  },
});

export const createHubSurveyUseCase = withValidationAndAuth({
  schema: createHubSurveySchema,
  useCase: async ({ hubId, surveyTemplateId }, user) => {
    return await db.transaction(async (tx) => {
      const students = await tx
        .select({ id: student.id })
        .from(student)
        .leftJoin(studentHub, eq(student.id, studentHub.studentId))
        .where(and(eq(studentHub.hubId, hubId), eq(student.userId, user.id)));

      if (students.length === 0) {
        return {
          success: false,
          message: "No students found for this hub",
        };
      }

      const [survey] = await tx
        .insert(surveys)
        .values({
          hubId,
          userId: user.id,
          surveyTemplateId,
        })
        .returning({ id: surveys.id });

      if (!survey) {
        tx.rollback();
        return {
          success: false,
          message: "Failed to create survey",
        };
      }

      const toAddSurveyResponses: InsertSurveyResponse[] = students.map(
        (student) => ({
          surveyId: survey.id,
          studentId: student.id,
        }),
      );

      await tx.insert(surveyResponses).values(toAddSurveyResponses);

      return {
        success: true,
        message: "Survey created successfully",
      };
    });
  },
});
