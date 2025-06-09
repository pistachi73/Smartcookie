import { z } from "zod";
import { SortBySchema } from "../questions/schemas";

export const GetSurveyTemplatesSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).default(10),
  sortBy: SortBySchema,
  q: z.string().optional(),
});

export const CreateSurveyTemplateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
  questions: z.array(
    z.object({
      id: z.number(),
      required: z.boolean(),
    }),
  ),
});

export const UpdateSurveyTemplateSchema = CreateSurveyTemplateSchema.extend({
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

export const DeleteSurveyTemplateSchema = z.object({
  id: z.number(),
});
