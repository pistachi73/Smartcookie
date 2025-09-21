"use server";

import { and, count, desc, eq, isNull } from "drizzle-orm";

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
        hubId: quickNote.hubId,
      })
      .from(quickNote)
      .where(
        and(
          eq(quickNote.userId, user.id),
          hubId === 0 ? isNull(quickNote.hubId) : eq(quickNote.hubId, hubId),
        ),
      )
      .orderBy(desc(quickNote.createdAt));

    return notes as NoteSummary[];
  },
});

export const getUserQuickNoteCount = withProtectedDataAccess({
  callback: async (user) => {
    const result = await db
      .select({ count: count() })
      .from(quickNote)
      .where(eq(quickNote.userId, user.id));

    return result[0]?.count || 0;
  },
});
