"use server";

import { db } from "@/db";
import { sessionNote } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { withValidationAndAuth } from "../protected-data-access";
import {
  CreateSessionNoteSchema,
  DeleteSessionNoteSchema,
  UpdateSessionNoteSchema,
} from "./schemas";

export const addSessionNote = withValidationAndAuth({
  schema: CreateSessionNoteSchema,
  callback: async (data, userId) => {
    const [createdSessonNote] = await db
      .insert(sessionNote)
      .values({ ...data, userId })
      .returning();

    return createdSessonNote;
  },
});

export const updateSessionNote = withValidationAndAuth({
  schema: UpdateSessionNoteSchema,
  callback: async (data, userId) => {
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

export const deleteSessionNote = withValidationAndAuth({
  schema: DeleteSessionNoteSchema,
  callback: async ({ noteId, sessionId }, userId) => {
    const [deletedNote] = await db
      .delete(sessionNote)
      .where(and(eq(sessionNote.id, noteId), eq(sessionNote.userId, userId)))
      .returning();

    return deletedNote;
  },
});
