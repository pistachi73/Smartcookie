import { z } from "zod";

export const GetSurveysByHubIdSchema = z.object({
  hubId: z.number(),
});

export const DeleteSurveySchema = z.object({
  surveyId: z.string(),
});

export const CreateHubSurveySchema = z.object({
  hubId: z.number(),
  surveyTemplateId: z.number(),
});

export const CheckStudentHasSurveyAccessSchema = z.object({
  email: z.string().email(),
  surveyId: z.string(),
});

export const SubmitSurveySchema = z.object({
  surveyResponseId: z.number(),
  surveyTemplateId: z.number(),
  startedAt: z.string(),
  responses: z.record(z.string(), z.string()),
});
