"use server";

import { and, eq } from "drizzle-orm";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { sessionNote } from "@/db/schema";
import { authenticatedDataAccess } from "../data-access-chain";
import { sessionNoteLimitMiddleware } from "../limit-middleware";
import {
  CreateSessionNoteSchema,
  DeleteSessionNoteSchema,
  UpdateSessionNoteSchema,
} from "./schemas";

export const addSessionNote = authenticatedDataAccess()
  .input(CreateSessionNoteSchema)
  .use(async ({ data, user }) =>
    sessionNoteLimitMiddleware({ user, content: data.content }),
  )
  .execute(async (data, user) => {
    const [createdSessonNote] = await db
      .insert(sessionNote)
      .values({ ...data, userId: user.id })
      .returning();

    return createdSessonNote;
  });

export const updateSessionNote = authenticatedDataAccess()
  .input(UpdateSessionNoteSchema)
  .use(async ({ data, user }) =>
    sessionNoteLimitMiddleware({ user, content: data.content || "" }),
  )
  .execute(async (data, user) => {
    const { noteId, ...noteData } = data;

    const [updatedNote] = await db
      .update(sessionNote)
      .set(noteData)
      .where(and(eq(sessionNote.id, noteId), eq(sessionNote.userId, user.id)))
      .returning({
        id: sessionNote.id,
        sessionId: sessionNote.sessionId,
        position: sessionNote.position,
        content: sessionNote.content,
        updatedAt: sessionNote.updatedAt,
      });

    return updatedNote;
  });

export const deleteSessionNote = withProtectedDataAccess({
  schema: DeleteSessionNoteSchema,
  callback: async ({ noteId, sessionId: _sessionId }, user) => {
    const [deletedNote] = await db
      .delete(sessionNote)
      .where(and(eq(sessionNote.id, noteId), eq(sessionNote.userId, user.id)))
      .returning();

    return deletedNote;
  },
});
