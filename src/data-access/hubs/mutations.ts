"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { hub } from "@/db/schema";
import { authenticatedDataAccess } from "../data-access-chain";
import { createDataAccessError } from "../errors";
import { getHubLimitMiddleware } from "../limit-middleware";
import {
  CreateHubUseCaseSchema,
  DeleteHubSchema,
  UpdateHubSchema,
} from "./schemas";

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

export const updateHub = authenticatedDataAccess()
  .input(UpdateHubSchema)
  .execute(async (data, user) => {
    const { hubId, data: updateData } = data;

    const [updatedHub] = await db
      .update(hub)
      .set(updateData)
      .where(and(eq(hub.id, hubId), eq(hub.userId, user.id)))
      .returning();

    if (!updatedHub) {
      return createDataAccessError({
        type: "UNEXPECTED_ERROR",
        message: "Hub not updated successfully. Please try again.",
      });
    }

    return updatedHub;
  });

export const deleteHub = authenticatedDataAccess()
  .input(DeleteHubSchema)
  .execute(async (data, user) => {
    const { hubId } = data;

    await db.delete(hub).where(and(eq(hub.id, hubId), eq(hub.userId, user.id)));
  });
