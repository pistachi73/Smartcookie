import { z } from "zod";

export const GetSurveysByHubIdSchema = z.object({
  hubId: z.number(),
});

export const DeleteSurveySchema = z.object({
  surveyId: z.string(),
});
