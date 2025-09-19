"use server";

import { and, desc, eq } from "drizzle-orm";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { type SessionNotePosition, sessionNote } from "@/db/schema";
import { GetSessionNotesBySessionIdSchema } from "./schemas";

export const getSessionNotesBySessionId = withProtectedDataAccess({
  schema: GetSessionNotesBySessionIdSchema,
  callback: async ({ sessionId }, user) => {
    const notes = await db
      .select({
        id: sessionNote.id,
        sessionId: sessionNote.sessionId,
        position: sessionNote.position,
        content: sessionNote.content,
      })
      .from(sessionNote)
      .where(
        and(
          eq(sessionNote.sessionId, sessionId),
          eq(sessionNote.userId, user.id),
        ),
      )
      .orderBy(desc(sessionNote.updatedAt));

    const ret = notes.reduce<Record<SessionNotePosition, typeof notes>>(
      (acc, note) => {
        acc[note.position] = [...(acc[note.position] || []), { ...note }];
        return acc;
      },
      {
        plans: [],
        "in-class": [],
      } as Record<SessionNotePosition, typeof notes>,
    );

    return ret;
  },
});
