"use server";

import { db } from "@/db";
import { session } from "@/db/schema";
import { currentUser } from "@/shared/lib/auth";
import type { z } from "zod";
import type { AddSessionUseCaseSchema } from "../lib/schemas";

export const addSessionUseCase = async (
  data: z.infer<typeof AddSessionUseCaseSchema>,
) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const [createdSession] = await db
    .insert(session)
    .values({
      ...data,
      status: "upcoming",
    })
    .returning();

  return createdSession;
};
