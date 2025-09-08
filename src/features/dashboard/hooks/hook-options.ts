import { queryOptions } from "@tanstack/react-query";
import { getWeek, getYear } from "date-fns";

import { getWeeklyHours } from "@/data-access/sessions/queries";

export const getWeeklyHoursQueryOptions = (date: string) => {
  const dateObj = new Date(date);
  const year = getYear(dateObj);
  const yearWeek = getWeek(dateObj);

  return queryOptions({
    queryKey: ["weekly-hours", { year, yearWeek }],
    queryFn: () => getWeeklyHours({ date }),
  });
};
