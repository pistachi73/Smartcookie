"use server";

import { and, count, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { student, surveyResponses, surveys as surveysTable } from "@/db/schema";
import { withValidationAndAuth } from "../protected-data-access";

export const getSurveyTemplateResponses = withValidationAndAuth({
  schema: z.object({
    surveyTemplateId: z.number(),
  }),
  callback: async ({ surveyTemplateId }, user) => {
    const baseCondition = and(
      eq(surveysTable.surveyTemplateId, surveyTemplateId),
      eq(surveysTable.userId, user.id),
    );

    const [responses, uncompletedCountResult] = await Promise.all([
      db
        .select({
          id: surveyResponses.id,
          completedAt: surveyResponses.completedAt,
          startedAt: surveyResponses.startedAt,
          createdAt: surveyResponses.createdAt,
          student: {
            id: student.id,
            name: student.name,
            email: student.email,
            image: student.image,
          },
        })
        .from(surveyResponses)
        .innerJoin(surveysTable, eq(surveyResponses.surveyId, surveysTable.id))
        .innerJoin(student, eq(surveyResponses.studentId, student.id))
        .where(and(baseCondition, eq(surveyResponses.completed, true)))
        .orderBy(desc(surveyResponses.createdAt)),

      db
        .select({ count: count() })
        .from(surveyResponses)
        .innerJoin(surveysTable, eq(surveyResponses.surveyId, surveysTable.id))
        .where(and(baseCondition, eq(surveyResponses.completed, false))),
    ]);

    const uncompletedCount = uncompletedCountResult[0]?.count || 0;

    return {
      responses,
      uncompletedCount,
    };
  },
});

export const getSurveyTemplateResponseAnswers = withValidationAndAuth({
  schema: z.object({
    surveyResponseId: z.number(),
  }),
  callback: async ({ surveyResponseId }) => {
    const studentResponse = await db.query.surveyResponses.findFirst({
      where: and(
        eq(surveyResponses.id, surveyResponseId),
        eq(surveyResponses.completed, true),
      ),
      columns: {
        completedAt: true,
      },
      with: {
        answers: {
          columns: {
            id: true,
            value: true,
            additionalComment: true,
          },
          with: {
            question: {
              columns: { id: true, type: true },
            },
          },
        },
      },
    });

    if (!studentResponse) {
      return {
        id: surveyResponseId,
        completedAt: null,
        answers: [],
      };
    }

    const answers = studentResponse.answers.map((answer) => ({
      id: answer.id,
      value: answer.value,
      additionalComment: answer.additionalComment,
      question: answer.question,
    }));

    return {
      id: surveyResponseId,
      completedAt: studentResponse.completedAt,
      answers,
    };
  },
});

export const getSurveyResponsesBySurveyId = withValidationAndAuth({
  schema: z.object({
    surveyId: z.string(),
  }),
  callback: async ({ surveyId }) => {
    const responses = await db.query.surveyResponses.findMany({
      where: and(
        eq(surveyResponses.surveyId, surveyId),
        eq(surveyResponses.completed, true),
        eq(surveyResponses.status, "active"),
      ),
      columns: {
        id: true,
        completedAt: true,
      },
      with: {
        survey: {
          columns: {},
          with: {
            surveyTemplate: {
              columns: {},
              with: {
                surveyTemplateQuestions: {
                  columns: {
                    questionId: true,
                  },
                },
              },
            },
          },
        },
        student: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },

        answers: {
          columns: {
            id: true,
            value: true,
            questionId: true,
          },
        },
      },
    });

    return responses;
  },
});
