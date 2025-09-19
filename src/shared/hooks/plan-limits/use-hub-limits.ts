import { useQuery } from "@tanstack/react-query";

import {
  canCreate,
  getRemainingCount,
  isAtLimit,
  isUnlimited,
} from "@/core/config/plan-limits";
import { getUserHubCountQueryOptions } from "./query-options/hub-count-query-options";
import { useUserPlanLimits } from "./use-user-plan-limits";

export const useHubLimits = () => {
  const limits = useUserPlanLimits();
  const {
    data: current = 0,
    isLoading,
    error,
  } = useQuery(getUserHubCountQueryOptions);

  const max = limits.hubs.maxCount;

  return {
    max,
    current,
    remaining: getRemainingCount(current, max),
    isAtLimit: isAtLimit(current, max),
    canCreate: canCreate(current, max),
    isUnlimited: isUnlimited(max),
    isLoading,
    error,
  };
};
