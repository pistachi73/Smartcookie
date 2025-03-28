"use server";

import { db } from "@/db";
import { hub, studentHub } from "@/db/schema";
import type { z } from "zod";
import type { CreateHubUseCaseSchema } from "../lib/schemas";

export const createHubUseCase = async (
  data: z.infer<typeof CreateHubUseCaseSchema>,
) => {
  const { userId, sessionIds, studentIds, hubInfo } = data;
  const { description, level, schedule, endDate, ...rest } = hubInfo;

  return await db.transaction(async (trx) => {
    const [createdHub] = await trx
      .insert(hub)
      .values({
        userId,
        description: description ?? null,
        level: level ?? null,
        schedule: schedule ?? null,
        endDate: endDate ?? null,
        ...rest,
      })
      .returning();

    const hubId = createdHub?.id;
    if (!hubId) {
      throw new Error("Hub not created");
    }

    const toInsertStudentHubs = studentIds?.map((studentId) => ({
      hubId,
      studentId,
    }));

    await Promise.all([
      !!toInsertStudentHubs?.length &&
        trx.insert(studentHub).values(toInsertStudentHubs),
    ]);

    return createdHub;
  });
};
