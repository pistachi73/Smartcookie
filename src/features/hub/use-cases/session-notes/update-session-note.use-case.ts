"use server";

import { db } from "@/db";
import { sessionNote } from "@/db/schema";
import { currentUser } from "@/shared/lib/auth";
import { and, eq } from "drizzle-orm";
import type { z } from "zod";
import type { UpdateSessionNoteInputSchema } from "../../lib/schemas";

export const updateSessionNoteUseCase = async (
  update: z.infer<typeof UpdateSessionNoteInputSchema>,
) => {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not found");
  }

  const [updatedNote] = await db
    .update(sessionNote)
    .set({
      sessionId: update.target.sessionId,
      position: update.target.position,
    })
    .where(
      and(eq(sessionNote.id, update.noteId), eq(sessionNote.userId, user.id)),
    )
    .returning({
      id: sessionNote.id,
      sessionId: sessionNote.sessionId,
      position: sessionNote.position,
    });

  if (!updatedNote) {
    throw new Error("Failed to update note");
  }

  return updatedNote;
};
