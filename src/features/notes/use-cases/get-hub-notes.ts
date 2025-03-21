import { db } from "@/db";
import { quickNote } from "@/db/schema";
import type { NoteSummary } from "@/features/notes/types/quick-notes.types";
import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";

export const GetHubNotesSchema = z.object({
  hubId: z.number(),
});

export const getHubNotesUseCase = async ({
  userId,
  hubId,
}: {
  userId: string;
  hubId: number;
}) => {
  const notes = await db
    .select({
      id: quickNote.id,
      content: quickNote.content,
      updatedAt: quickNote.updatedAt,
      hubId: quickNote.hubId,
    })
    .from(quickNote)
    .where(
      and(
        eq(quickNote.userId, userId),
        hubId === 0 ? isNull(quickNote.hubId) : eq(quickNote.hubId, hubId),
      ),
    )
    .orderBy(desc(quickNote.updatedAt));

  return notes as NoteSummary[];
};
