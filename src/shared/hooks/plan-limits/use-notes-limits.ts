import { useQuery } from "@tanstack/react-query";

import {
  canCreate,
  getRemainingCount,
  isAtLimit,
  isUnlimited,
} from "@/core/config/plan-limits";
import { getUserQuickNoteCountQueryOptions } from "./query-options/notes-count-query-options";
import { useUserPlanLimits } from "./use-user-plan-limits";

export const useNotesLimits = () => {
  const limits = useUserPlanLimits();
  const {
    data: current = 0,
    isLoading,
    error,
  } = useQuery(getUserQuickNoteCountQueryOptions);

  const max = limits.notes.maxCount;
  const maxCharacters = limits.notes.maxCharactersPerNote;

  return {
    max,
    current,
    remaining: getRemainingCount(current, max),
    isAtLimit: isAtLimit(current, max),
    canCreate: canCreate(current, max),
    isUnlimited: isUnlimited(max),
    maxCharacters,
    isLoading,
    error,
  };
};
