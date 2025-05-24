import { z } from "zod";

export const SubmitSurveySchema = z.object({
  surveyResponseId: z.number(),
  responses: z.record(z.string(), z.string()),
});
