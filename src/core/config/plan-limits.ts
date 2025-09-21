import type { UserSubscription } from "@/db/schema";

export enum CommunityAccess {
  WEBINAR = "webinar",
  FORUM = "forum",
  EXCLUSIVE = "exclusive",
}

export enum SupportType {
  NONE = "none",
  STANDARD = "standard",
  PRIORITY = "priority",
}

export interface PlanLimits {
  hubs: {
    maxCount: number;
  };
  sessions: {
    maxPerHub: number;
    maxCharactersPerNote: number;
  };
  students: {
    maxCount: number;
  };
  notes: {
    maxCount: number;
    maxCharactersPerNote: number;
  };
  community: {
    access: CommunityAccess;
  };
  support: {
    type: SupportType;
  };
  features: {
    scheduleConflictNotification: boolean;
    feedbackProgressTracking: boolean;
  };
}

export const PLAN_LIMITS: Record<
  UserSubscription["tier"] | "free",
  PlanLimits
> = {
  free: {
    hubs: {
      maxCount: 2,
    },
    sessions: {
      maxPerHub: 20,
      maxCharactersPerNote: 100,
    },
    students: {
      maxCount: 10,
    },
    notes: {
      maxCount: 20,
      maxCharactersPerNote: 100,
    },
    community: {
      access: CommunityAccess.WEBINAR,
    },
    support: {
      type: SupportType.NONE,
    },
    features: {
      scheduleConflictNotification: false,
      feedbackProgressTracking: false,
    },
  },
  basic: {
    hubs: {
      maxCount: 2,
    },
    sessions: {
      maxPerHub: 40,
      maxCharactersPerNote: 100,
    },

    students: {
      maxCount: 40,
    },
    notes: {
      maxCount: 10,
      maxCharactersPerNote: 280,
    },
    community: {
      access: CommunityAccess.FORUM,
    },
    support: {
      type: SupportType.STANDARD,
    },
    features: {
      scheduleConflictNotification: true,
      feedbackProgressTracking: true,
    },
  },
  premium: {
    hubs: {
      maxCount: Number.POSITIVE_INFINITY,
    },
    sessions: {
      maxPerHub: Number.POSITIVE_INFINITY,
      maxCharactersPerNote: 100,
    },
    students: {
      maxCount: Number.POSITIVE_INFINITY,
    },
    notes: {
      maxCount: Number.POSITIVE_INFINITY,
      maxCharactersPerNote: 500,
    },
    community: {
      access: CommunityAccess.EXCLUSIVE,
    },
    support: {
      type: SupportType.PRIORITY,
    },
    features: {
      scheduleConflictNotification: true,
      feedbackProgressTracking: true,
    },
  },
};

// Helper functions for working with limits
export const isUnlimited = (limit: number): boolean => {
  return !Number.isFinite(limit);
};

export const isAtLimit = (current: number, max: number): boolean => {
  return Number.isFinite(max) && current >= max;
};

export const canCreate = (current: number, max: number): boolean => {
  return !Number.isFinite(max) || current < max;
};

export const getRemainingCount = (current: number, max: number): number => {
  return Number.isFinite(max)
    ? Math.max(0, max - current)
    : Number.POSITIVE_INFINITY;
};

export const getPlanLimits = (plan?: UserSubscription["tier"] | "free") => {
  return PLAN_LIMITS[plan || "free"];
};
