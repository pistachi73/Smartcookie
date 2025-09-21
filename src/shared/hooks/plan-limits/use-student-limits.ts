import { useQuery } from "@tanstack/react-query";

import {
  canCreate,
  getRemainingCount,
  isAtLimit,
  isUnlimited,
} from "@/core/config/plan-limits";
import { getUserStudentCountQueryOptions } from "./query-options/student-count-query-options";
import { useUserPlanLimits } from "./use-user-plan-limits";

export const useStudentLimits = () => {
  const limits = useUserPlanLimits();
  const {
    data: current = 0,
    isLoading,
    error,
  } = useQuery(getUserStudentCountQueryOptions);

  const max = limits.students.maxCount;

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
