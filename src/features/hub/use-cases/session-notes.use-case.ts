"use server";

import { db } from "@/db";
import { type SessionNotePosition, sessionNote } from "@/db/schema";
import { withValidationAndAuth } from "@/shared/lib/protected-use-case";
import { and, desc, eq } from "drizzle-orm";
import {
  CreateSessionNoteUseCaseSchema,
  DeleteSessionNoteUseCaseSchema,
  GetSessionNotesUseCaseSchema,
  UpdateSessionNoteUseCaseSchema,
} from "../lib/session-notes.schema";

export const getSessionNotesUseCase = withValidationAndAuth({
  schema: GetSessionNotesUseCaseSchema,
  useCase: async ({ sessionId }, userId) => {
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
          eq(sessionNote.userId, userId),
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

export const addSessionNoteUseCase = withValidationAndAuth({
  schema: CreateSessionNoteUseCaseSchema,
  useCase: async (data, userId) => {
    const [createdSessonNote] = await db
      .insert(sessionNote)
      .values({ ...data, userId })
      .returning();

    if (!createdSessonNote) {
      throw new Error("Failed to create session note");
    }

    return createdSessonNote;
  },
});

export const updateSessionNoteUseCase = withValidationAndAuth({
  schema: UpdateSessionNoteUseCaseSchema,
  useCase: async (data, userId) => {
    const { noteId, target } = data;

    const [updatedNote] = await db
      .update(sessionNote)
      .set({
        sessionId: target.sessionId,
        position: target.position,
      })
      .where(and(eq(sessionNote.id, noteId), eq(sessionNote.userId, userId)))
      .returning({
        id: sessionNote.id,
        sessionId: sessionNote.sessionId,
        position: sessionNote.position,
      });

    if (!updatedNote) {
      throw new Error("Failed to update note");
    }

    return updatedNote;
  },
});

export const deleteSessionNoteUseCase = withValidationAndAuth({
  schema: DeleteSessionNoteUseCaseSchema,
  useCase: async ({ noteId, sessionId }, userId) => {
    const [deletedNote] = await db
      .delete(sessionNote)
      .where(and(eq(sessionNote.id, noteId), eq(sessionNote.userId, userId)))
      .returning();

    return deletedNote;
  },
});
