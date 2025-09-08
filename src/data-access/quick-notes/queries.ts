"use server";

import { and, desc, eq, isNull } from "drizzle-orm";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { quickNote } from "@/db/schema";
import type { NoteSummary } from "@/features/quick-notes/types/quick-notes.types";
import { GetNotesByHubIdSchema } from "./schemas";

export const getNotesByHubId = withProtectedDataAccess({
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
