import { db } from "@/db";
import { quickNote } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const DeleteQuickNoteSchema = z.object({
  id: z.number(),
});

export const deleteQuickNoteUseCase = async ({
  userId,
  id,
}: {
  userId: string;
  id: number;
}) => {
  await db
    .delete(quickNote)
    .where(and(eq(quickNote.id, id), eq(quickNote.userId, userId)));

  return { success: true };
};
