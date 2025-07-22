"use server";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { surveys } from "@/db/schema";
import { withValidationAndAuth } from "../protected-data-access";
import { GetSurveysByHubIdSchema } from "./schemas";

export const getSurveysByHubId = withValidationAndAuth({
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
