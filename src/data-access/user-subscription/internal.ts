"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userSubscription } from "@/db/schema";

/**
 * Internal: Direct DB query for auth callbacks to avoid circular dependency
 * DO NOT use this function outside of auth system - use getUserSubscriptionByUserId instead
 */
export const getUserSubscriptionByUserIdInternal = async (userId: string) => {
  return await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
    columns: {
      tier: true,
      status: true,
    },
  });
};
