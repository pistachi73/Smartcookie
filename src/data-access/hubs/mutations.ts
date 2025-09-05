"use server";

import { db } from "@/db";
import { hub, studentHub } from "@/db/schema";
import { addSessions } from "../sessions/mutations";
import { withProtectedDataAccess } from "../with-protected-data-access";
import { CreateHubUseCaseSchema } from "./schemas";

export const createHub = withProtectedDataAccess({
  schema: CreateHubUseCaseSchema,
  callback: async (data, user) => {
    const { sessions, studentIds, hubInfo } = data;
    const { description, level, schedule, endDate, name, ...rest } = hubInfo;

    const trimOrNull = (value: string | null | undefined): string | null =>
      typeof value === "string" ? value.trim() || null : null;

    const hubData = {
      userId: user.id,
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

      await Promise.all([
        studentIds?.length
          ? trx.insert(studentHub).values(
              studentIds.map((studentId) => ({
                hubId,
                studentId,
              })),
            )
          : Promise.resolve(),
        sessions?.length
          ? addSessions({
              sessions,
              hubId,
              trx,
            })
          : Promise.resolve(),
      ]);

      return createdHub;
    });
  },
});
