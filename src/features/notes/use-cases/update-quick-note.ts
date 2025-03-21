import { db } from "@/db";
import { quickNote } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const UpdateQuickNoteSchema = z.object({
  id: z.number(),
  content: z.string(),
  updatedAt: z.string().optional(),
});

export const updateQuickNoteUseCase = async ({
  userId,
  id,
  content,
  updatedAt,
}: {
  userId: string;
  id: number;
  content: string;
  updatedAt?: string;
}) => {
  const updateData: Record<string, unknown> = {
    content,
  };

  // Only set updatedAt if explicitly provided
  if (updatedAt) {
    updateData.updatedAt = updatedAt;
  }

  const updatedNote = await db
    .update(quickNote)
    .set(updateData)
    .where(and(eq(quickNote.id, id), eq(quickNote.userId, userId)))
    .returning({
      id: quickNote.id,
      content: quickNote.content,
      updatedAt: quickNote.updatedAt,
      hubId: quickNote.hubId,
    });

  return updatedNote[0];
};
