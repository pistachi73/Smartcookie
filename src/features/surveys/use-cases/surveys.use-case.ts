"use server";

import { db } from "@/db";
import {
  type InsertAnswer,
  answers,
  questions,
  surveyTemplateQuestions,
  surveyTemplates,
  surveys,
} from "@/db/schema";
import { student } from "@/db/schema/student";
import { surveyResponses } from "@/db/schema/survey-responses";
import { withValidationOnly } from "@/shared/lib/protected-use-case";
import { and, asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { SubmitSurveySchema } from "../lib/survey.schema";

export const getSurveyByIdUseCase = withValidationOnly({
  schema: z.object({
    surveyId: z.string(),
  }),
  useCase: async ({ surveyId }) => {
    const s = await db.query.surveys.findFirst({
      columns: {
        id: true,
        createdAt: true,
      },
      with: {
        surveyTemplate: {
          columns: {
            id: true,
            title: true,
            description: true,
          },
          with: {
            surveyTemplateQuestions: {
              columns: {
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
        },
      },
      where: eq(surveys.id, surveyId),
    });

    if (!s) return null;

    const { surveyTemplateQuestions: stq, ...surveyTemplateRest } =
      s.surveyTemplate;
    const questions = stq.map((q) => ({
      required: q.required,
      order: q.order,
      ...q.question,
    }));

    return {
      ...surveyTemplateRest,
      questions,
    };
  },
});

export const checkStudentHasSurveyAccessUseCase = withValidationOnly({
  schema: z.object({
    email: z.string().email(),
    surveyId: z.string(),
  }),
  useCase: async ({ email, surveyId }) => {
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
      return {
        success: false,
        message:
          "You do not have access to this survey. Please contact your teacher.",
      };
    }

    if (response.completed) {
      return {
        success: false,
        message: "Survey already completed.",
      };
    }

    return {
      success: true,
      message: "Student has survey access",
      data: response,
    };
  },
});

export const submitSurveyUseCase = withValidationOnly({
  schema: SubmitSurveySchema,
  useCase: async ({ surveyResponseId, surveyTemplateId, responses }) => {
    // Filter out empty/undefined responses
    const filteredResponses = Object.entries(responses).filter(
      ([, value]) => value !== "" && value !== undefined,
    );

    if (filteredResponses.length === 0) {
      throw new Error("No valid responses to submit.");
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
      throw new Error("Survey already completed.");
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

    await db.transaction(async (tx) => {
      await Promise.all([
        tx
          .update(surveyResponses)
          .set({ completed: true, completedAt: new Date().toISOString() })
          .where(eq(surveyResponses.id, surveyResponseId)),
        tx.insert(answers).values(toInsertAnswers),
        tx
          .update(surveyTemplates)
          .set({ totalResponses: sql`${surveyTemplates.totalResponses} + 1` })
          .where(eq(surveyTemplates.id, surveyTemplateId)),
        ...questionIds.map((questionId) =>
          tx
            .update(questions)
            .set({ totalAnswers: sql`${questions.totalAnswers} + 1` })
            .where(eq(questions.id, questionId)),
        ),
      ]);
    });

    return { success: true };
  },
});
