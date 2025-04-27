import { queryOptions } from "@tanstack/react-query";
import { getDayOfYear, getWeek, getYear } from "date-fns";
import {
  getAgendaSessionsUseCase,
  getWeeklyHoursUseCase,
} from "../use-cases/dashboard.use-case";

export const getAgendaSessionsQueryOptions = (
  userId: string,
  dateInterval: [Date, Date],
) => {
  const dayOfYear = getDayOfYear(dateInterval[0]);
  const dayOfYearEnd = getDayOfYear(dateInterval[1]);
  const startYear = getYear(dateInterval[0]);
  const endYear = getYear(dateInterval[1]);

  return queryOptions({
    queryKey: [
      "agenda-sessions",
      userId,
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

export const getWeeklyHoursQueryOptions = (userId: string, date: string) => {
  const dateObj = new Date(date);
  const year = getYear(dateObj);
  const yearWeek = getWeek(dateObj);

  return queryOptions({
    queryKey: ["weekly-hours", userId, `${yearWeek}-${year}`],
    queryFn: () => getWeeklyHoursUseCase({ date }),
  });
};
