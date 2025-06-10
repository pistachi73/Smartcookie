import { z } from "zod";

export const CreateQuickNoteSchema = z.object({
  hubId: z.number(),
  content: z.string().max(1000),
  updatedAt: z.string(),
});

export const UpdateQuickNoteSchema = z.object({
  id: z.number(),
  content: z.string().max(1000),
  updatedAt: z.string().optional(),
});

export const DeleteQuickNoteSchema = z.object({
  id: z.number(),
});

export const GetNotesByHubIdSchema = z.object({
  hubId: z.number(),
});
