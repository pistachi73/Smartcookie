import {
  addDays,
  eachDayOfInterval,
  getDay,
  getMonth,
  startOfMonth,
} from "date-fns";

import type { CalendarView } from "../types/calendar.types";

export const getWeekdayCardinal = (
  date: Date,
): {
  label: string;
  cardinal: number;
} => {
  const selectedWeekday = getDay(date);
  const startOfThisMonth = startOfMonth(date);

  const daysInMonth = eachDayOfInterval({
    start: startOfThisMonth,
    end: date,
  });

  // Count occurrences of the weekday up to the provided date
  const occurrenceCount = daysInMonth.reduce((count, currentDate) => {
    return getDay(currentDate) === selectedWeekday ? count + 1 : count;
  }, 0);

  // Determine the ordinal suffix
  const suffixes = ["th", "st", "nd", "rd"];
  const v = occurrenceCount % 100;
  const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];

  const isLastWeekdayOccurrenceInMonth =
    getMonth(date) !== getMonth(addDays(date, 7));

  return {
    label: `${occurrenceCount}${suffix}`,
    cardinal: isLastWeekdayOccurrenceInMonth ? -1 : occurrenceCount,
  };
};

export const isCalendarView = (
  calendarView: any,
): calendarView is CalendarView => {
  return (
    typeof calendarView === "string" &&
    (calendarView === "month" ||
      calendarView === "week" ||
      calendarView === "day" ||
      calendarView === "weekday" ||
      calendarView === "agenda")
  );
};
