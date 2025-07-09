import type { UserSubscriptionStatus } from "@/db/schema/user-subscription";

// Plan type includes 'free' for users without subscription and 'pro' from schema
export type SubscriptionPlan = "free" | "pro";

export interface PlanLimits {
  hubs: {
    maxCount: number;
    maxStudentsPerHub: number;
  };
  sessions: {
    maxPerMonth: number;
    maxDurationMinutes: number;
  };
  students: {
    maxCount: number;
  };
  storage: {
    maxFileSizeMB: number;
    maxTotalStorageGB: number;
  };
  features: {
    advancedReporting: boolean;
    customBranding: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
    bulkOperations: boolean;
    exportData: boolean;
  };
  ui: {
    blockedSections: string[];
    restrictedActions: string[];
  };
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    hubs: {
      maxCount: 1,
      maxStudentsPerHub: 5,
    },
    sessions: {
      maxPerMonth: 10,
      maxDurationMinutes: 60,
    },
    students: {
      maxCount: 5,
    },
    storage: {
      maxFileSizeMB: 10,
      maxTotalStorageGB: 1,
    },
    features: {
      advancedReporting: false,
      customBranding: false,
      apiAccess: false,
      prioritySupport: false,
      bulkOperations: false,
      exportData: false,
    },
    ui: {
      blockedSections: ["/portal/billing/advanced", "/portal/api-keys"],
      restrictedActions: ["bulk-export", "custom-reports"],
    },
  },
  pro: {
    hubs: {
      maxCount: -1, // unlimited
      maxStudentsPerHub: -1, // unlimited
    },
    sessions: {
      maxPerMonth: -1, // unlimited
      maxDurationMinutes: -1, // unlimited
    },
    students: {
      maxCount: -1, // unlimited
    },
    storage: {
      maxFileSizeMB: 100,
      maxTotalStorageGB: -1, // unlimited
    },
    features: {
      advancedReporting: true,
      customBranding: true,
      apiAccess: true,
      prioritySupport: true,
      bulkOperations: true,
      exportData: true,
    },
    ui: {
      blockedSections: [],
      restrictedActions: [],
    },
  },
};

// Helper functions
export const getPlanLimits = (plan: SubscriptionPlan): PlanLimits => {
  return SUBSCRIPTION_LIMITS[plan];
};

export const isFeatureEnabled = (
  plan: SubscriptionPlan,
  feature: keyof PlanLimits["features"],
): boolean => {
  return SUBSCRIPTION_LIMITS[plan].features[feature];
};

export const isUnlimited = (value: number): boolean => {
  return value === -1;
};

export const canCreateHub = (
  plan: SubscriptionPlan,
  currentHubCount: number,
): boolean => {
  const limits = getPlanLimits(plan);
  return (
    isUnlimited(limits.hubs.maxCount) || currentHubCount < limits.hubs.maxCount
  );
};

export const isSectionBlocked = (
  plan: SubscriptionPlan,
  sectionPath: string,
): boolean => {
  const limits = getPlanLimits(plan);
  return limits.ui.blockedSections.includes(sectionPath);
};

export const isActionRestricted = (
  plan: SubscriptionPlan,
  action: string,
): boolean => {
  const limits = getPlanLimits(plan);
  return limits.ui.restrictedActions.includes(action);
};

/**
 * Determines the user's plan based on their subscription status
 * Users without an active subscription are treated as 'free' plan
 */
export const getUserPlan = (
  subscription: { status: UserSubscriptionStatus; tier: string } | null,
): SubscriptionPlan => {
  if (!subscription || subscription.status === "inactive") {
    return "free";
  }

  return subscription.tier === "pro" ? "pro" : "free";
};

/**
 * Checks if a user has an active subscription
 */
export const hasActiveSubscription = (
  subscription: { status: UserSubscriptionStatus } | null,
): boolean => {
  return subscription?.status === "active";
};
