import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { Temporal } from "temporal-polyfill";
import { getDayKeyFromDate } from "../lib/utils";
import { getCalendarSessionsByDateRangeUseCase } from "../use-cases/calendar.use-case";

export const getMonthSessionsQueryOptions = (
  periodDate: Temporal.PlainDateTime,
) => {
  const currentPeriodStart = periodDate.with({
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
  });
  const currentPeriodEnd = periodDate.with({
    day: periodDate.daysInMonth,
    hour: 23,
    minute: 59,
    second: 59,
  });

  return queryOptions({
    queryKey: [
      "calendar-sessions",
      `${currentPeriodStart.year}-${currentPeriodStart.month}`,
    ],
    queryFn: () =>
      getCalendarSessionsByDateRangeUseCase({
        startDate: currentPeriodStart.toString(),
        endDate: currentPeriodEnd.toString(),
      }),
  });
};

// Fetch data by month
export const useMonthSessions = (yearMonth: {
  year: number;
  month: number;
}) => {
  const { year, month } = yearMonth;
  const user = useCurrentUser();

  const firstDayOfMonth = new Temporal.PlainDateTime(year, month, 1);

  const { data, isLoading } = useQuery(
    getMonthSessionsQueryOptions(firstDayOfMonth),
  );

  return {
    sessionsByDay: data || {},
    allSessions: data || [],
    isLoading,
  };
};

// Helper to access a specific day
export const useCalendarDay = (date: Temporal.PlainDate) => {
  const { year, month } = date;
  const { sessionsByDay, isLoading } = useMonthSessions({ year, month });

  const dateKey = getDayKeyFromDate(date);
  const dayData = sessionsByDay[dateKey] || [];

  return {
    sessions: dayData,
    isLoading,
  };
};
