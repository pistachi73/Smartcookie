import { useMemo } from "react";
import { useCalendarContext } from "../calendar-context";
import {
  getMonthName,
  getWeekBoundaries,
  getWeekDays,
  getYearNumber,
} from "../utils";

export const useWeekCalendar = () => {
  const { selectedDate } = useCalendarContext();

  const currentWeekMonthNames = useMemo(() => {
    if (!selectedDate) return [getMonthName(new Date())];
    const { startDay, lastDay } = getWeekBoundaries(selectedDate);
    return Array.from(new Set([getMonthName(startDay), getMonthName(lastDay)]));
  }, [selectedDate]);

  const currentYearNumber = useMemo(() => {
    if (!selectedDate) return getYearNumber(new Date());
    return getYearNumber(selectedDate);
  }, [selectedDate]);

  const weekDays = useMemo(() => {
    if (!selectedDate) return getWeekDays(new Date());
    return getWeekDays(selectedDate);
  }, [selectedDate]);

  return { currentWeekMonthNames, currentYearNumber, weekDays };
};
