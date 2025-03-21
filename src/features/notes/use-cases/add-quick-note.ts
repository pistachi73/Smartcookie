import { db } from "@/db";
import { quickNote } from "@/db/schema";
import { z } from "zod";

export const AddQuickNoteSchema = z.object({
  userId: z.string(),
  hubId: z.number(),
  content: z.string(),
  updatedAt: z.string(),
});

export const addQuickNoteUseCase = async ({
  userId,
  hubId,
  content,
  updatedAt,
}: z.infer<typeof AddQuickNoteSchema>) => {
  const actualHubId = hubId === 0 ? null : hubId;

  const newNote = await db
    .insert(quickNote)
    .values({
      content,
      hubId: actualHubId,
      updatedAt,
      userId,
    })
    .returning();

  return newNote[0];
};
