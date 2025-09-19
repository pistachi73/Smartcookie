import { useQuery } from "@tanstack/react-query";

import { canCreate, getRemainingCount } from "@/core/config/plan-limits";
import { getSessionsCountByHubIdQueryOptions } from "./query-options/sessions-count-query-options";
import { useUserPlanLimits } from "./use-user-plan-limits";

export const useSessionLimits = (hubId: number) => {
  const planLimits = useUserPlanLimits();
  const { data: currentCount = 0, isLoading } = useQuery(
    getSessionsCountByHubIdQueryOptions(hubId),
  );

  const maxSessions = planLimits.sessions.maxPerHub;
  const remainingCount = getRemainingCount(currentCount, maxSessions);
  const canCreateSession = canCreate(currentCount, maxSessions);

  return {
    currentCount,
    maxSessions,
    remainingCount,
    canCreateSession,
    isUnlimited: !Number.isFinite(maxSessions),
    isLoading,
  };
};
