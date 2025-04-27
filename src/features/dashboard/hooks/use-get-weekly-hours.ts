import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyHoursQueryOptions } from "./hook-options";

export const useGetWeeklyHours = (date: string) => {
  const user = useCurrentUser();
  return useQuery(getWeeklyHoursQueryOptions(user.id, date));
};
