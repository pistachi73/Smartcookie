import { addDays, endOfWeek, format, startOfWeek } from "date-fns";

export const getWeekBoundaries = (date: Date) => {
  // You can specify which day to consider as the start of the week; by default, it is Sunday (0).
  // To set Monday as the start of the week, we can pass { weekStartsOn: 1 }.

  const startDay = startOfWeek(date, { weekStartsOn: 1 });
  const lastDay = endOfWeek(date, { weekStartsOn: 1 });

  return { startDay, lastDay };
};

export const getWeekDays = (date: Date): Date[] => {
  const startDay = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }).map((_, i) => addDays(startDay, i));
};

export const getMonthName = (date: Date): string => format(date, "LLLL");
export const getYearNumber = (date: Date): number =>
  Number.parseInt(format(date, "yyyy"), 10);
