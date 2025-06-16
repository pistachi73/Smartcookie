"use server";

import { db } from "@/db";

import { surveys } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { withValidationAndAuth } from "../protected-data-access";
import { GetSurveysByHubIdSchema } from "./schemas";

export const getSurveysByHubId = withValidationAndAuth({
  schema: GetSurveysByHubIdSchema,
  callback: async ({ hubId }, userId) => {
    const res = await db.query.surveys.findMany({
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

    const formattedSurveys = res.map((survey, index) => {
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
