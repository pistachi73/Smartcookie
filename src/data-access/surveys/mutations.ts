"use server";

import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  answers,
  type InsertAnswer,
  type InsertSurveyResponse,
  questions,
  student,
  studentHub,
  surveyResponses,
  surveys,
  surveyTemplates,
} from "@/db/schema";
import { createDataAccessError } from "../errors";
import { withProtectedDataAccess } from "../with-protected-data-access";
import {
  CheckStudentHasSurveyAccessSchema,
  CreateHubSurveySchema,
  DeleteSurveySchema,
  SubmitSurveySchema,
} from "./schemas";

export const deleteSurvey = withProtectedDataAccess({
  schema: DeleteSurveySchema,
  callback: async ({ surveyId }, user) => {
    await db
      .delete(surveys)
      .where(and(eq(surveys.id, surveyId), eq(surveys.userId, user.id)));
  },
});

export const createHubSurvey = withProtectedDataAccess({
  schema: CreateHubSurveySchema,
  callback: async ({ hubId, surveyTemplateId }, user) => {
    return await db.transaction(async (tx) => {
      const students = await tx
        .select({ id: student.id })
        .from(student)
        .leftJoin(studentHub, eq(student.id, studentHub.studentId))
        .where(and(eq(studentHub.hubId, hubId), eq(student.userId, user.id)));

      if (students.length === 0) {
        return createDataAccessError({
          type: "NOT_FOUND",
          message: "No students found for this hub",
        });
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
        return createDataAccessError({
          type: "UNEXPECTED_ERROR",
          message: "Failed to create survey",
        });
      }

      const toAddSurveyResponses: InsertSurveyResponse[] = students.map(
        (student) => ({
          surveyId: survey.id,
          studentId: student.id,
        }),
      );

      await tx.insert(surveyResponses).values(toAddSurveyResponses);

      return true;
    });
  },
});

export const checkStudentHasSurveyAccess = withProtectedDataAccess({
  options: { requireAuth: false },
  schema: CheckStudentHasSurveyAccessSchema,
  callback: async ({ email, surveyId }) => {
    const [response] = await db
      .select({
        id: surveyResponses.id,
        studentId: surveyResponses.studentId,
        completed: surveyResponses.completed,
      })
      .from(surveyResponses)
      .innerJoin(student, eq(surveyResponses.studentId, student.id))
      .where(
        and(eq(student.email, email), eq(surveyResponses.surveyId, surveyId)),
      )
      .limit(1);
    if (!response) {
      return createDataAccessError({
        type: "AUTHENTICATION_ERROR",
        message:
          "You do not have access to this survey. Please contact your teacher.",
      });
    }

    if (response.completed) {
      return createDataAccessError({
        type: "UNEXPECTED_ERROR",
        message: "Survey already completed.",
      });
    }

    const startedAt = new Date().toISOString();
    //Set survey resopnse startedAt
    await db
      .update(surveyResponses)
      .set({ startedAt })
      .where(eq(surveyResponses.id, response.id));

    return {
      ...response,
      startedAt,
    };
  },
});

export const submitSurvey = withProtectedDataAccess({
  options: { requireAuth: false },
  schema: SubmitSurveySchema,
  callback: async ({
    surveyResponseId,
    surveyTemplateId,
    responses,
    startedAt,
  }) => {
    // Filter out empty/undefined responses
    const filteredResponses = Object.entries(responses).filter(
      ([, value]) => value !== "" && value !== undefined,
    );

    if (filteredResponses.length === 0) {
      return createDataAccessError({
        type: "NOT_FOUND",
        message: "No valid responses to submit.",
      });
    }

    const [surveyResponded] = await db
      .select({
        id: surveyResponses.id,
      })
      .from(surveyResponses)
      .where(
        and(
          eq(surveyResponses.id, surveyResponseId),
          eq(surveyResponses.completed, true),
        ),
      )
      .limit(1);

    if (surveyResponded) {
      return createDataAccessError({
        type: "SURVEY_ALREADY_COMPLETED",
        message: "Survey already completed.",
      });
    }

    const toInsertAnswers: InsertAnswer[] = filteredResponses.map(
      ([questionId, value]) => ({
        surveyResponseId: surveyResponseId,
        questionId: Number(questionId),
        value,
      }),
    );

    const questionIds = [
      ...new Set(
        toInsertAnswers.map((a) => a.questionId).filter(Boolean) as number[],
      ),
    ];

    const responseTimeInMilliseconds = Math.round(
      Date.now() - new Date(startedAt).getTime(),
    );

    await db.transaction(async (tx) => {
      await Promise.all([
        tx
          .update(surveyResponses)
          .set({ completed: true, completedAt: new Date().toISOString() })
          .where(eq(surveyResponses.id, surveyResponseId)),
        tx.insert(answers).values(toInsertAnswers),
        tx
          .update(surveyTemplates)
          .set({
            totalResponses: sql`${surveyTemplates.totalResponses} + 1`,
            averageResponseTime: sql`(${surveyTemplates.averageResponseTime} * ${surveyTemplates.totalResponses} + ${responseTimeInMilliseconds}) / (${surveyTemplates.totalResponses} + 1)`,
          })
          .where(eq(surveyTemplates.id, surveyTemplateId)),
        ...questionIds.map((questionId) =>
          tx
            .update(questions)
            .set({
              totalAnswers: sql`${questions.totalAnswers} + 1`,
            })
            .where(eq(questions.id, questionId)),
        ),
      ]);
    });

    return { success: true };
  },
});
