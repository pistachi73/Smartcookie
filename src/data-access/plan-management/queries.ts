import { dataAccess, protectedDataAccess } from "../data-access-chain";
import { createDataAccessError } from "../errors";
import { getUserById } from "../user/utils";
import {
  handleDowngradeResourceLimits,
  handleUpgradeResourceRestoration,
} from "./mutations";
import { downgradePlanSchema, upgradePlanSchema } from "./schemas";
import {
  getUserResourceCounts,
  isPlanDowngrade,
  isPlanUpgrade,
  isValidPlanTransition,
} from "./utils";

/**
 * Upgrade a user's plan and handle resource restoration
 */
export const upgradePlan = dataAccess()
  .input(upgradePlanSchema)
  .execute(async ({ userId, fromTier, toTier }) => {
    // Validate the user can only upgrade their own plan
    const user = await getUserById(userId);

    if (!user) {
      return createDataAccessError({
        type: "USER_NOT_FOUND",
        message: "User not found",
        meta: { userId },
      });
    }

    // Validate it's actually an upgrade
    if (!isValidPlanTransition(fromTier, toTier)) {
      return createDataAccessError({
        type: "INVALID_PLAN_TRANSITION",
        message: "Invalid plan transition",
        meta: { fromTier, toTier },
      });
    }

    if (!isPlanUpgrade(fromTier, toTier)) {
      return createDataAccessError({
        type: "NOT_AN_UPGRADE",
        message: "This is not an upgrade. Use downgradePlan for downgrades.",
        meta: { fromTier, toTier },
      });
    }

    console.log("Upgrade in mutation", { fromTier, toTier });
    try {
      // Get current resource counts before upgrade
      const currentCounts = await getUserResourceCounts(userId);
      console.log("Current counts", currentCounts);

      // Handle resource restoration based on new plan limits
      const restorationResults = await handleUpgradeResourceRestoration(
        userId,
        toTier,
      );

      // Get final resource counts after restoration
      const finalCounts = await getUserResourceCounts(userId);

      return {
        success: true,
        planTransition: {
          from: fromTier,
          to: toTier,
          type: "upgrade" as const,
        },
        resourceChanges: {
          before: currentCounts,
          after: finalCounts,
          restored: restorationResults,
        },
      };
    } catch (error) {
      return createDataAccessError({
        type: "UPGRADE_FAILED",
        message: `Plan upgrade failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        meta: { fromTier, toTier },
      });
    }
  });

/**
 * Downgrade a user's plan and handle resource archiving
 */
export const downgradePlan = dataAccess()
  .input(downgradePlanSchema)
  .execute(async ({ userId, fromTier, toTier }) => {
    // Validate the user can only downgrade their own plan
    const user = await getUserById(userId);

    if (!user) {
      return createDataAccessError({
        type: "USER_NOT_FOUND",
        message: "User not found",
        meta: { userId },
      });
    }

    // Validate it's actually a downgrade
    if (!isValidPlanTransition(fromTier, toTier)) {
      return createDataAccessError({
        type: "INVALID_PLAN_TRANSITION",
        message: "Invalid plan transition",
        meta: { fromTier, toTier },
      });
    }

    if (!isPlanDowngrade(fromTier, toTier)) {
      return createDataAccessError({
        type: "NOT_A_DOWNGRADE",
        message: "This is not a downgrade. Use upgradePlan for upgrades.",
        meta: { fromTier, toTier },
      });
    }

    try {
      // Get current resource counts before downgrade
      const currentCounts = await getUserResourceCounts(userId);

      // Handle resource archiving based on new plan limits
      const archivingResults = await handleDowngradeResourceLimits(
        userId,
        toTier,
      );

      // Get final resource counts after archiving
      const finalCounts = await getUserResourceCounts(userId);

      return {
        success: true,
        planTransition: {
          from: fromTier,
          to: toTier,
          type: "downgrade" as const,
        },
        resourceChanges: {
          before: currentCounts,
          after: finalCounts,
          archived: archivingResults,
        },
        warnings: generateDowngradeWarnings(currentCounts, archivingResults),
      };
    } catch (error) {
      return createDataAccessError({
        type: "DOWNGRADE_FAILED",
        message: `Plan downgrade failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        meta: { fromTier, toTier },
      });
    }
  });

/**
 * Generate warnings for users about what will be archived during downgrade
 */
const generateDowngradeWarnings = (
  _currentCounts: {
    hubs: number;
    students: number;
  },
  archivingResults: {
    hubs: { archived: number };
    students: { archived: number };
  },
) => {
  const warnings: string[] = [];

  if (archivingResults.hubs.archived > 0) {
    warnings.push(
      `${archivingResults.hubs.archived} hub(s) and their sessions have been archived and will be hidden`,
    );
  }

  if (archivingResults.students.archived > 0) {
    warnings.push(
      `${archivingResults.students.archived} student(s) have been archived and will be hidden`,
    );
  }

  return warnings;
};

/**
 * Get a preview of what would happen during a plan change
 */
export const previewPlanChange = protectedDataAccess(
  upgradePlanSchema.or(downgradePlanSchema),
).execute(async ({ userId, fromTier, toTier }, user) => {
  if (user.id !== userId) {
    return createDataAccessError({
      type: "UNAUTHORIZED",
      message: "You can only preview your own plan changes",
    });
  }

  if (!isValidPlanTransition(fromTier, toTier)) {
    return createDataAccessError({
      type: "INVALID_PLAN_TRANSITION",
      message: "Invalid plan transition",
      meta: { fromTier, toTier },
    });
  }

  const currentCounts = await getUserResourceCounts(userId);
  const isUpgrade = isPlanUpgrade(fromTier, toTier);

  if (isUpgrade) {
    // For upgrades, show what could be restored
    const restorationResults = await handleUpgradeResourceRestoration(
      userId,
      toTier,
    );

    return {
      type: "upgrade" as const,
      fromTier,
      toTier,
      currentCounts,
      changes: {
        restored: restorationResults,
      },
      warnings: [],
    };
  }

  // For downgrades, show what would be archived
  const archivingResults = await handleDowngradeResourceLimits(userId, toTier);

  return {
    type: "downgrade" as const,
    fromTier,
    toTier,
    currentCounts,
    changes: {
      archived: archivingResults,
    },
    warnings: generateDowngradeWarnings(currentCounts, archivingResults),
  };
});
