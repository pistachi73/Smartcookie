"use server";

import { db } from "@/db";
import { hub } from "@/db/schema";
import { authenticatedDataAccess } from "../data-access-chain";
import { createDataAccessError } from "../errors";
import { getHubLimitMiddleware } from "../limit-middleware";
import { CreateHubUseCaseSchema } from "./schemas";

export const createHub = authenticatedDataAccess()
  .input(CreateHubUseCaseSchema)
  .use(getHubLimitMiddleware)
  .execute(async (data, user) => {
    const { hubInfo } = data;
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

    const [createdHub] = await db.insert(hub).values(hubData).returning();

    const hubId = createdHub?.id;

    if (!hubId) {
      return createDataAccessError({
        type: "UNEXPECTED_ERROR",
        message: "Hub not created successfully. Please try again.",
      });
    }

    return createdHub;
  });
