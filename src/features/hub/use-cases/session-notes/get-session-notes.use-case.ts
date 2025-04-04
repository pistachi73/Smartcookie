"use server";

import { db } from "@/db";
import { type SessionNotePosition, sessionNote } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import type { z } from "zod";
import type { GetSessionNotesUseCaseSchema } from "../../lib/schemas";

export const getSessionNotesUseCase = async ({
  sessionId,
}: z.infer<typeof GetSessionNotesUseCaseSchema>) => {
  const notes = await db
    .select({
      id: sessionNote.id,
      sessionId: sessionNote.sessionId,
      position: sessionNote.position,
      content: sessionNote.content,
    })
    .from(sessionNote)
    .where(eq(sessionNote.sessionId, sessionId))
    .orderBy(desc(sessionNote.updatedAt));

  return notes.reduce<Record<SessionNotePosition, typeof notes>>(
    (acc, note) => {
      acc[note.position] = [...(acc[note.position] || []), note];
      return acc;
    },
    {} as Record<SessionNotePosition, typeof notes>,
  );
};
