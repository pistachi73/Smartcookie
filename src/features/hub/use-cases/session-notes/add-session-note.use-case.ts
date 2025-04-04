"use server";

import { db } from "@/db";
import { sessionNote } from "@/db/schema";
import { currentUser } from "@/shared/lib/auth";
import type { z } from "zod";
import type { AddSessionNoteUseCaseSchema } from "../../lib/schemas";

export const addSessionNoteUseCase = async (
  data: z.infer<typeof AddSessionNoteUseCaseSchema>,
) => {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not found");
  }

  const [createdSessonNote] = await db
    .insert(sessionNote)
    .values({ ...data, userId: user.id })
    .returning();

  return createdSessonNote;
};
