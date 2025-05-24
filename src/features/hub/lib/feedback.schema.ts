import { z } from "zod";

export const createHubSurveySchema = z.object({
  hubId: z.number(),
  surveyTemplateId: z.number(),
});
