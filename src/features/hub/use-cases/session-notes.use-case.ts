"use server";

import { db } from "@/db";
import { sessionNote } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { z } from "zod";
import type { DeleteSessionNoteUseCaseSchema } from "../lib/schemas";

export const deleteSessionNoteUseCase = async ({
  noteId,
  userId,
}: z.infer<typeof DeleteSessionNoteUseCaseSchema>) => {
  console.log({ userId, noteId });
  const [deletedNote] = await db
    .delete(sessionNote)
    .where(and(eq(sessionNote.id, noteId), eq(sessionNote.userId, userId)))
    .returning();

  return deletedNote;
};
