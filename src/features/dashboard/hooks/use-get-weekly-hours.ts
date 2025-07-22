import { useQuery } from "@tanstack/react-query";

import { getWeeklyHoursQueryOptions } from "./hook-options";

export const useGetWeeklyHours = (date: string) => {
  return useQuery(getWeeklyHoursQueryOptions(date));
};
