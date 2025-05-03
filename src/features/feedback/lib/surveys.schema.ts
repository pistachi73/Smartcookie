import { z } from "zod";
import { SortBySchema } from "./questions.schema";

export const GetSurveysSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).default(10),
  sortBy: SortBySchema,
  q: z.string().optional(),
});

export const CreateSurveySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  questions: z.array(z.number()),
});
