import type { CalendarView } from "@/stores/calendar-store";
import { CalendarDate, CalendarDateTime, Time } from "@internationalized/date";
import {
  add,
  addDays,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
} from "date-fns";
import type { ReadonlyURLSearchParams } from "next/navigation";
import type { z } from "zod";
import type { SessionOcurrenceFormSchema } from "./event-occurrence-form/schema";

export const ROW_HEIGHT = 48;
export const TIMESLOT_HEIGHT = ROW_HEIGHT / 4;
const CALENDAR_START_HOUR = 0; // Adjust based on your calendar's start hour
const CALENDAR_END_HOUR = 24; // Adjust based on your calendar's end hour
const TOTAL_MINUTES = (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * 60;
const PIXELS_PER_MINUTE = ROW_HEIGHT / 60;
export const PIXELS_PER_15_MINUTES = ROW_HEIGHT / 4;
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

export const formatCalendarHeaderTitle = (
  date: Date,
  calendarType: CalendarView,
) => {
  switch (calendarType) {
    case "day":
      return format(date, "d LLLL, yyyy");
    case "week":
      return `${format(startOfWeek(date, { weekStartsOn: 1 }), "d LLLL")} - ${format(
        endOfWeek(date, { weekStartsOn: 1 }),
        "d LLLL",
      )} ${format(date, "yyyy")}`;
    case "month":
      return format(date, "LLLL, yyyy");

    case "agenda": {
      const rangeEndDate = addDays(date, 14);
      if (isSameMonth(date, rangeEndDate)) {
        return `${format(date, "LLLL, yyyy")}`;
      }
      return `${format(date, "LLLL, yyyy")} - ${format(rangeEndDate, "LLLL, yyyy")}`;
    }
    default:
      return "";
  }
};

export const generateOccurrenceEncodedOverrides = ({
  timeslotPosition,
  date,
}: { timeslotPosition: number; date: Date }) => {
  const startTime = new Time(0, 0).add({ minutes: timeslotPosition * 15 });
  const endTime = startTime.add({ minutes: 30 });

  const startDate = new CalendarDateTime(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    startTime.hour,
    startTime.minute,
  ).toString();

  const endDate = new CalendarDateTime(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    endTime.hour,
    endTime.minute,
  ).toString();

  const overrides = [startDate, endDate];
  const encodedOverrides = encodeURIComponent(JSON.stringify(overrides));

  return encodedOverrides;
};

export const consumeOccurrenceOverrides = (
  searchParams: ReadonlyURLSearchParams,
): Partial<z.infer<typeof SessionOcurrenceFormSchema>> | undefined => {
  const encodedOverrides = searchParams.get("overrides");
  if (!encodedOverrides) return;

  try {
    const overridesArray: string[] = JSON.parse(
      decodeURIComponent(encodedOverrides),
    );

    const [startDateString, endDateString, timezone] = overridesArray;

    const startDate = startDateString ? new Date(startDateString) : undefined;
    const endDate = endDateString ? new Date(endDateString) : undefined;

    return {
      date: startDate
        ? new CalendarDate(
            startDate.getFullYear(),
            startDate.getMonth() + 1,
            startDate.getDate(),
          )
        : undefined,
      startTime: startDate
        ? new Time(startDate.getHours(), startDate.getMinutes())
        : undefined,
      endTime: endDate
        ? new Time(endDate.getHours(), endDate.getMinutes())
        : undefined,
      timezone,
    };
  } catch (error) {
    console.error("Error parsing occurrence overrides:", error);
    return;
  }
};

export const getEventOccurrenceDayKey = (date: Date) => {
  if (!date) return "";
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const calculateOccurrenceTop = ({
  hours,
  minutes,
}: { hours: number; minutes: number }): number => {
  const totalMinutes = (hours - CALENDAR_START_HOUR) * 60 + minutes;
  return totalMinutes * PIXELS_PER_MINUTE;
};

export const calculateOccurrenceHeight = (
  startTime: Date,
  endTime: Date,
): number => {
  const start = startTime.getTime();
  const end = endTime.getTime();
  const duration = (end - start) / (1000 * 60); // Duration in minutes
  return duration * PIXELS_PER_MINUTE;
};

export const getSnapToNearest15MinutesIndex = (yPosition: number) => {
  return Math.round(yPosition / PIXELS_PER_15_MINUTES);
};

export const getDateFromSnapIndex = ({
  snapIndex,
  date,
}: { snapIndex: number; date: Date }): Date => {
  const minutes = snapIndex * 15;
  const currentDate = new Date(date);
  const snapDate = add(currentDate, { minutes });

  return snapDate;
};
