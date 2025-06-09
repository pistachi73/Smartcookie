import { z } from "zod";

export const SortBySchema = z
  .enum(["alphabetical", "newest", "response-count"])
  .default("alphabetical");

export type SortBy = z.infer<typeof SortBySchema>;

export const GetQuestionsSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).default(10),
  sortBy: SortBySchema,
  q: z.string().optional(),
});

export const CreateQuestionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  enableAdditionalComment: z.boolean(),
  questionType: z.enum(["text", "rating", "boolean"]),
});

export const UpdateQuestionSchema = CreateQuestionSchema.partial().extend({
  id: z.number(),
});

export const DeleteQuestionSchema = z.object({
  id: z.number(),
});
