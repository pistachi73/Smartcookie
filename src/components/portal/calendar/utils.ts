import { CalendarDate, CalendarDateTime, Time } from "@internationalized/date";
import { addDays, endOfWeek, format, startOfWeek } from "date-fns";
import { ReadonlyURLSearchParams } from "next/navigation";
import { z } from "zod";
import { SessionOcurrenceFormSchema } from "./components/session-ocurrence-form/schema";

export const ROW_HEIGHT = 48;
export const TIMESLOT_HEIGHT = ROW_HEIGHT / 4;

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

export const handleCalendarColumnDoubleClick = (
  event: React.MouseEvent<HTMLDivElement>,
  containerId: string,
  date: Date,
) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const top = event.clientY - container.getBoundingClientRect().top;
  const timeslotPosition = Math.trunc(top / TIMESLOT_HEIGHT);

  const encodedOverrides = generateOccurrenceEncodedOverrides({
    timeslotPosition,
    date,
  });

  const params = new URLSearchParams({
    overrides: encodedOverrides,
  });

  // window.history.pushState(
  //   null,
  //   "",
  //   `/calendar/session/create?${params.toString()}`,
  // );
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
  console.log({ encodedOverrides });
  if (!encodedOverrides) return;

  try {
    const overridesArray: string[] = JSON.parse(
      decodeURIComponent(encodedOverrides),
    );

    const [startDateString, endDateString] = overridesArray;

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
    };
  } catch (error) {
    console.error("Error parsing occurrence overrides:", error);
    return;
  }
};
