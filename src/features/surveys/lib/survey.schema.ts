import { z } from "zod";

export const SubmitSurveySchema = z.object({
  surveyResponseId: z.number(),
  surveyTemplateId: z.number(),
  startedAt: z.string(),
  responses: z.record(z.string(), z.string()),
});
