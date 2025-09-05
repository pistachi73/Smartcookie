"use server";

import { and, asc, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { surveys, surveyTemplateQuestions } from "@/db/schema";
import { withProtectedDataAccess } from "../with-protected-data-access";
import { GetSurveysByHubIdSchema } from "./schemas";

export const getSurveysByHubId = withProtectedDataAccess({
  schema: GetSurveysByHubIdSchema,
  callback: async ({ hubId }, user) => {
    const res = await db.query.surveys.findMany({
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
          with: {
            surveyTemplateQuestions: {
              columns: {},
              with: {
                question: {
                  columns: {
                    id: true,
                    title: true,
                    type: true,
                  },
                },
              },
              orderBy: (t, { asc }) => [asc(t.order)],
            },
          },
        },
        surveyResponses: {
          columns: {
            id: true,
            completed: true,
          },
          where: (t, { eq }) => eq(t.status, "active"),
        },
      },
      orderBy: [desc(surveys.createdAt)],
    });

    const formattedSurveys = res.map((survey) => {
      const { surveyTemplate, ...rest } = survey;
      return {
        ...rest,
        surveyTemplate: {
          ...surveyTemplate,
          questions: surveyTemplate.surveyTemplateQuestions.map(
            (surveyTemplateQuestion) => surveyTemplateQuestion.question,
          ),
        },
      };
    });
    return formattedSurveys;
  },
});

export const getSurveyById = withProtectedDataAccess({
  options: { requireAuth: false },
  schema: z.object({
    surveyId: z.string(),
  }),
  callback: async ({ surveyId }) => {
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
