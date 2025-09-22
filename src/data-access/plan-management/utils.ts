import { and, count, desc, eq } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { hub, student } from "@/db/schema";
import type { PlanTier, ResourceCounts } from "./schemas";

/**
 * Get current resource counts for a user
 */
export const getUserResourceCounts = cache(
  async (userId: string): Promise<ResourceCounts> => {
    const [hubsCount, studentsCount] = await Promise.all([
      db
        .select({ count: count() })
        .from(hub)
        .where(and(eq(hub.userId, userId), eq(hub.status, "active"))),

      db
        .select({ count: count() })
        .from(student)
        .where(and(eq(student.userId, userId), eq(student.status, "active"))),
    ]);

    return {
      hubs: hubsCount[0]?.count || 0,
      students: studentsCount[0]?.count || 0,
    };
  },
);

/**
 * Check if a plan transition is valid (upgrade or downgrade)
 */
export const isValidPlanTransition = (
  fromTier: PlanTier,
  toTier: PlanTier,
): boolean => {
  const tierOrder = { free: 0, basic: 1, premium: 2 };
  return tierOrder[fromTier] !== tierOrder[toTier];
};

/**
 * Check if it's an upgrade (moving to a higher tier)
 */
export const isPlanUpgrade = (
  fromTier: PlanTier,
  toTier: PlanTier,
): boolean => {
  const tierOrder = { free: 0, basic: 1, premium: 2 };
  return tierOrder[toTier] > tierOrder[fromTier];
};

/**
 * Check if it's a downgrade (moving to a lower tier)
 */
export const isPlanDowngrade = (
  fromTier: PlanTier,
  toTier: PlanTier,
): boolean => {
  const tierOrder = { free: 0, basic: 1, premium: 2 };
  return tierOrder[toTier] < tierOrder[fromTier];
};

/**
 * Get the least recently active hubs to archive (by last activity date)
 */
export const getOldestHubsToArchive = async (
  userId: string,
  keepCount: number,
) => {
  const hubs = await db
    .select({ id: hub.id })
    .from(hub)
    .where(and(eq(hub.userId, userId), eq(hub.status, "active")))
    .orderBy(desc(hub.lastActivityAt))
    .offset(keepCount);

  return hubs.map((h) => h.id);
};

export const getOldestStudentsToArchive = async (
  userId: string,
  keepCount: number,
) => {
  const students = await db
    .select({ id: student.id })
    .from(student)
    .where(and(eq(student.userId, userId), eq(student.status, "active")))
    .orderBy(desc(student.createdAt))
    .offset(keepCount);

  return students.map((s) => s.id);
};

// Sessions are automatically handled when hubs are archived due to cascade relationship
// No separate session archiving needed

/**
 * Get the most recently active archived hubs to restore first
 */
export const getArchivedHubsToRestore = async (
  userId: string,
  maxCount: number,
) => {
  const hubs = await db
    .select({ id: hub.id })
    .from(hub)
    .where(and(eq(hub.userId, userId), eq(hub.status, "inactive")))
    .orderBy(desc(hub.lastActivityAt))
    .limit(maxCount);

  return hubs.map((h) => h.id);
};

export const getArchivedStudentsToRestore = async (
  userId: string,
  maxCount: number,
) => {
  const students = await db
    .select({ id: student.id })
    .from(student)
    .where(and(eq(student.userId, userId), eq(student.status, "inactive")))
    .orderBy(desc(student.createdAt))
    .limit(maxCount);

  return students.map((s) => s.id);
};
