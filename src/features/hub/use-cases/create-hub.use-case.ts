"use server";

import { db } from "@/db";
import { hub, studentHub } from "@/db/schema";
import type { z } from "zod";
import type { CreateHubUseCaseSchema } from "../lib/schemas";

export const createHubUseCase = async (
  data: z.infer<typeof CreateHubUseCaseSchema>,
) => {
  const { userId, sessionIds, studentIds, hubInfo } = data;
  const { description, level, schedule, endDate, name, ...rest } = hubInfo;

  const trimOrNull = (value: string | null | undefined): string | null =>
    typeof value === "string" ? value.trim() || null : null;

  const hubData = {
    userId,
    name: name.trim(),
    description: trimOrNull(description),
    level: trimOrNull(level),
    schedule: trimOrNull(schedule),
    endDate: endDate ?? null,
    ...rest,
  };

  return await db.transaction(async (trx) => {
    const [createdHub] = await trx.insert(hub).values(hubData).returning();

    const hubId = createdHub?.id;
    if (!hubId) {
      throw new Error("Hub not created");
    }

    if (studentIds?.length) {
      const toInsertStudentHubs = studentIds.map((studentId) => ({
        hubId,
        studentId,
      }));

      await trx.insert(studentHub).values(toInsertStudentHubs);
    }

    return createdHub;
  });
};
