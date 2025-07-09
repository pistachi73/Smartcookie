"use server";

import { db } from "@/db";
import { quickNote } from "@/db/schema";
import type { NoteSummary } from "@/features/quick-notes/types/quick-notes.types";
import { and, desc, eq, isNull } from "drizzle-orm";
import { withValidationAndAuth } from "../protected-data-access";
import { GetNotesByHubIdSchema } from "./schemas";

export const getNotesByHubId = withValidationAndAuth({
  schema: GetNotesByHubIdSchema,
  callback: async ({ hubId }, user) => {
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
          eq(quickNote.userId, user.id),
          hubId === 0 ? isNull(quickNote.hubId) : eq(quickNote.hubId, hubId),
        ),
      )
      .orderBy(desc(quickNote.updatedAt));

    return notes as NoteSummary[];
  },
});
