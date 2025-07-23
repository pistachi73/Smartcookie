import { queryOptions } from "@tanstack/react-query";
import { getDayOfYear, getWeek, getYear } from "date-fns";

import {
  getAgendaSessionsUseCase,
  getWeeklyHoursUseCase,
} from "../use-cases/dashboard.use-case";

export const getAgendaSessionsQueryOptions = (dateInterval: [Date, Date]) => {
  const dayOfYear = getDayOfYear(dateInterval[0]);
  const dayOfYearEnd = getDayOfYear(dateInterval[1]);
  const startYear = getYear(dateInterval[0]);
  const endYear = getYear(dateInterval[1]);

  return queryOptions({
    queryKey: [
      "agenda-sessions",
      `${dayOfYear}-${startYear}`,
      `${dayOfYearEnd}-${endYear}}`,
    ],
    queryFn: () =>
      getAgendaSessionsUseCase({
        dateInterval: [
          dateInterval[0].toISOString(),
          dateInterval[1].toISOString(),
        ],
      }),
  });
};

export const getWeeklyHoursQueryOptions = (date: string) => {
  const dateObj = new Date(date);
  const year = getYear(dateObj);
  const yearWeek = getWeek(dateObj);

  return queryOptions({
    queryKey: ["weekly-hours", `${yearWeek}-${year}`],
    queryFn: () => getWeeklyHoursUseCase({ date }),
  });
};
