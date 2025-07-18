"use server";

import { db } from "@/db";
import { type SessionNotePosition, sessionNote } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { withValidationAndAuth } from "../protected-data-access";
import { GetSessionNotesBySessionIdSchema } from "./schemas";

export const getSessionNotesBySessionId = withValidationAndAuth({
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

    return notes.reduce<Record<SessionNotePosition, typeof notes>>(
      (acc, note) => {
        acc[note.position] = [...(acc[note.position] || []), { ...note }];
        return acc;
      },
      {} as Record<SessionNotePosition, typeof notes>,
    );
  },
});
