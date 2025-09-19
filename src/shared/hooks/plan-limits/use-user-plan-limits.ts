import { PLAN_LIMITS } from "@/core/config/plan-limits";
import { useCurrentUser } from "../use-current-user";

export const useUserPlanLimits = () => {
  const user = useCurrentUser();

  return PLAN_LIMITS[user?.subscriptionTier || "free"];
};
