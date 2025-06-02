import { z } from "zod";
import { SortBySchema } from "./questions.schema";

export const GetSurveysSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).default(10),
  sortBy: SortBySchema,
  q: z.string().optional(),
});

export const SurveyTemplateFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  questions: z.array(
    z.object({
      id: z.number(),
      required: z.boolean(),
    }),
  ),
});

export const UpdateSurveyTemplateSchema = SurveyTemplateFormSchema.extend({
  id: z.number(),
  questions: z.array(
    z.object({
      id: z.number(),
      required: z.boolean(),
      order: z.number(),
      surveyTemplateQuestionId: z.number().optional(),
    }),
  ),
});

export const DeleteSurveySchema = z.object({
  id: z.number(),
});
