import { inArray } from "drizzle-orm";

import { PLAN_LIMITS } from "@/core/config/plan-limits";
import { db } from "@/db";
import { hub, student } from "@/db/schema";
import { createDataAccessError } from "../errors";
import type {
  ArchiveResourcesInput,
  PlanTier,
  UnarchiveResourcesInput,
} from "./schemas";
import {
  getArchivedHubsToRestore,
  getArchivedStudentsToRestore,
  getOldestHubsToArchive,
  getOldestStudentsToArchive,
  getUserResourceCounts,
} from "./utils";

/**
 * Archive excess resources when downgrading a plan
 */
export const archiveExcessResources = async ({
  userId,
  resourceType,
  keepCount,
}: ArchiveResourcesInput) => {
  try {
    switch (resourceType) {
      case "hubs": {
        const hubsToArchive = await getOldestHubsToArchive(userId, keepCount);
        console.log({ hubsToArchive });

        if (hubsToArchive.length > 0) {
          await db
            .update(hub)
            .set({ status: "inactive" })
            .where(inArray(hub.id, hubsToArchive));
        }
        return { archived: hubsToArchive.length };
      }

      case "students": {
        const studentsToArchive = await getOldestStudentsToArchive(
          userId,
          keepCount,
        );
        if (studentsToArchive.length > 0) {
          await db
            .update(student)
            .set({ status: "inactive" })
            .where(inArray(student.id, studentsToArchive));
        }
        return { archived: studentsToArchive.length };
      }

      default:
        return createDataAccessError({
          type: "INVALID_RESOURCE_TYPE",
          message: `Invalid resource type: ${resourceType}`,
        });
    }
  } catch (error) {
    return createDataAccessError({
      type: "ARCHIVE_FAILED",
      message: `Failed to archive ${resourceType}: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};

/**
 * Unarchive resources when upgrading a plan
 */
export const unarchiveResources = async ({
  userId,
  resourceType,
  maxCount,
}: UnarchiveResourcesInput) => {
  try {
    const currentCounts = await getUserResourceCounts(userId);

    switch (resourceType) {
      case "hubs": {
        const availableSlots = Math.max(0, maxCount - currentCounts.hubs);

        if (availableSlots === 0) return { unarchived: 0 };

        const hubsToRestore = await getArchivedHubsToRestore(
          userId,
          availableSlots,
        );

        if (hubsToRestore.length > 0) {
          await db
            .update(hub)
            .set({ status: "active" })
            .where(inArray(hub.id, hubsToRestore));
        }
        return { unarchived: hubsToRestore.length };
      }

      case "students": {
        const availableSlots = Math.max(0, maxCount - currentCounts.students);
        if (availableSlots === 0) return { unarchived: 0 };

        const studentsToRestore = await getArchivedStudentsToRestore(
          userId,
          availableSlots,
        );
        if (studentsToRestore.length > 0) {
          await db
            .update(student)
            .set({ status: "active" })
            .where(inArray(student.id, studentsToRestore));
        }
        return { unarchived: studentsToRestore.length };
      }

      default:
        return createDataAccessError({
          type: "INVALID_RESOURCE_TYPE",
          message: `Invalid resource type: ${resourceType}`,
        });
    }
  } catch (error) {
    return createDataAccessError({
      type: "UNARCHIVE_FAILED",
      message: `Failed to unarchive ${resourceType}: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
};

/**
 * Handle resource limits when downgrading a plan
 */
export const handleDowngradeResourceLimits = async (
  userId: string,
  toTier: PlanTier,
) => {
  const currentCounts = await getUserResourceCounts(userId);
  const newLimits = PLAN_LIMITS[toTier];
  const results = {
    hubs: { archived: 0 },
    students: { archived: 0 },
    notes: { archived: 0 },
    sessions: { archived: 0 },
  };

  // Archive excess hubs
  if (
    Number.isFinite(newLimits.hubs.maxCount) &&
    currentCounts.hubs > newLimits.hubs.maxCount
  ) {
    const hubResult = await archiveExcessResources({
      userId,
      resourceType: "hubs",
      keepCount: newLimits.hubs.maxCount,
    });
    if ("archived" in hubResult) {
      results.hubs = hubResult;
    }
  }

  // Archive excess students
  if (
    Number.isFinite(newLimits.students.maxCount) &&
    currentCounts.students > newLimits.students.maxCount
  ) {
    const studentResult = await archiveExcessResources({
      userId,
      resourceType: "students",
      keepCount: newLimits.students.maxCount,
    });
    if ("archived" in studentResult) {
      results.students = studentResult;
    }
  }

  return results;
};

/**
 * Handle resource restoration when upgrading a plan
 */
export const handleUpgradeResourceRestoration = async (
  userId: string,
  toTier: PlanTier,
) => {
  const newLimits = PLAN_LIMITS[toTier];
  const results = {
    hubs: { unarchived: 0 },
    students: { unarchived: 0 },
    notes: { unarchived: 0 },
    sessions: { unarchived: 0 },
  };

  // Unarchive hubs if new plan allows more
  const hubResult = await unarchiveResources({
    userId,
    resourceType: "hubs",
    maxCount: Number.isFinite(newLimits.hubs.maxCount)
      ? newLimits.hubs.maxCount
      : Number.MAX_SAFE_INTEGER,
  });
  if ("unarchived" in hubResult) {
    results.hubs = hubResult;
  }

  // Unarchive students if new plan allows more
  const studentResult = await unarchiveResources({
    userId,
    resourceType: "students",
    maxCount: Number.isFinite(newLimits.students.maxCount)
      ? newLimits.students.maxCount
      : Number.MAX_SAFE_INTEGER,
  });
  if ("unarchived" in studentResult) {
    results.students = studentResult;
  }

  // Unarchive quick notes if new plan allows more
  const noteResult = await unarchiveResources({
    userId,
    resourceType: "quick-notes",
    maxCount: Number.isFinite(newLimits.notes.maxCount)
      ? newLimits.notes.maxCount
      : Number.MAX_SAFE_INTEGER,
  });
  if ("unarchived" in noteResult) {
    results.notes = noteResult;
  }

  // Sessions are not restored as they are handled automatically with hubs

  return results;
};
