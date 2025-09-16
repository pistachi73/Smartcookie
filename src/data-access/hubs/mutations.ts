"use server";

import { count, eq } from "drizzle-orm";

import { getPlanLimits, isAtLimit } from "@/core/config/plan-limits";
import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { hub } from "@/db/schema";
import { createDataAccessError } from "../errors";
import { CreateHubUseCaseSchema } from "./schemas";

export const createHub = withProtectedDataAccess({
  schema: CreateHubUseCaseSchema,
  callback: async (data, user) => {
    const limits = getPlanLimits(user.subscriptionTier);

    return await db.transaction(async (trx) => {
      const hubsCount = await trx
        .select({ count: count() })
        .from(hub)
        .where(eq(hub.userId, user.id));

      const currentCount = hubsCount[0]?.count || 0;

      if (isAtLimit(currentCount, limits.hubs.maxCount)) {
        return createDataAccessError({
          type: "LIMIT_REACHED",
          message: `Hub limit reached (${currentCount}/${Number.isFinite(limits.hubs.maxCount) ? limits.hubs.maxCount : "∞"}). Upgrade your plan to create more hubs.`,
          meta: { current: currentCount, max: limits.hubs.maxCount },
        });
      }

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

      const [createdHub] = await trx.insert(hub).values(hubData).returning();

      const hubId = createdHub?.id;

      if (!hubId) {
        return createDataAccessError({
          type: "UNEXPECTED_ERROR",
          message: "Hub not created successfully. Please try again.",
        });
      }

      return createdHub;
    });
  },
});
