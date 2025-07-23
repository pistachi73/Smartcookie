"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { sessionNote } from "@/db/schema";
import { withValidationAndAuth } from "../protected-data-access";
import {
  CreateSessionNoteSchema,
  DeleteSessionNoteSchema,
  UpdateSessionNoteSchema,
} from "./schemas";

export const addSessionNote = withValidationAndAuth({
  schema: CreateSessionNoteSchema,
  callback: async (data, user) => {
    const [createdSessonNote] = await db
      .insert(sessionNote)
      .values({ ...data, userId: user.id })
      .returning();

    return createdSessonNote;
  },
});

export const updateSessionNote = withValidationAndAuth({
  schema: UpdateSessionNoteSchema,
  callback: async (data, user) => {
    const { noteId, target } = data;

    const [updatedNote] = await db
      .update(sessionNote)
      .set({
        sessionId: target.sessionId,
        position: target.position,
      })
      .where(and(eq(sessionNote.id, noteId), eq(sessionNote.userId, user.id)))
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
  callback: async ({ noteId, sessionId: _sessionId }, user) => {
    const [deletedNote] = await db
      .delete(sessionNote)
      .where(and(eq(sessionNote.id, noteId), eq(sessionNote.userId, user.id)))
      .returning();

    return deletedNote;
  },
});
