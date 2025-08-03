import { add, addDays, endOfWeek, format, startOfWeek } from "date-fns";
import { Temporal } from "temporal-polyfill";

import type { CalendarView } from "@/features/calendar/types/calendar.types";

export const ROW_HEIGHT = 72;
export const TIMESLOT_HEIGHT = ROW_HEIGHT / 4;
const CALENDAR_START_HOUR = 0; // Adjust based on your calendar's start hour
const CALENDAR_END_HOUR = 24; // Adjust based on your calendar's end hour
const _TOTAL_MINUTES = (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * 60;
const PIXELS_PER_MINUTE = ROW_HEIGHT / 60;
export const PIXELS_PER_15_MINUTES = ROW_HEIGHT / 4;

export const formatCalendarHeaderTitle = (
  date: Temporal.PlainDate,
  calendarType: CalendarView,
) => {
  // Convert Temporal date to JavaScript Date
  const jsDate = new Date(date.year, date.month - 1, date.day);

  switch (calendarType) {
    case "day":
      return format(jsDate, "d MMMM, yyyy");

    case "week": {
      const weekStart = startOfWeek(jsDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(jsDate, { weekStartsOn: 1 });

      // If start and end dates are in same month and year
      if (
        weekStart.getMonth() === weekEnd.getMonth() &&
        weekStart.getFullYear() === weekEnd.getFullYear()
      ) {
        return `${format(weekStart, "d")} - ${format(weekEnd, "d MMMM, yyyy")}`;
      }

      // If start and end dates are in same year but different months
      if (weekStart.getFullYear() === weekEnd.getFullYear()) {
        return `${format(weekStart, "d MMMM")} - ${format(weekEnd, "d MMMM, yyyy")}`;
      }

      // Different years
      return `${format(weekStart, "d MMMM, yyyy")} - ${format(weekEnd, "d MMMM, yyyy")}`;
    }

    case "month":
      return format(jsDate, "MMMM yyyy");

    case "agenda": {
      const rangeEndDate = addDays(jsDate, 14);

      // If same month, just show one month
      if (
        jsDate.getMonth() === rangeEndDate.getMonth() &&
        jsDate.getFullYear() === rangeEndDate.getFullYear()
      ) {
        return format(jsDate, "MMMM yyyy");
      }

      // If different month but same year
      if (jsDate.getFullYear() === rangeEndDate.getFullYear()) {
        return `${format(jsDate, "MMMM")} - ${format(rangeEndDate, "MMMM yyyy")}`;
      }

      // Different years
      return `${format(jsDate, "MMMM yyyy")} - ${format(rangeEndDate, "MMMM yyyy")}`;
    }

    default:
      return "";
  }
};

export const getDayKeyFromDate = (
  date: Temporal.ZonedDateTime | Temporal.PlainDate | Temporal.PlainDateTime,
): string => {
  const year = date.year;
  const month = date.month;
  const day = date.day;
  return `${year}-${month}-${day}`;
};

export const getDayKeyFromDateString = (day: string): string | null => {
  const date = new Date(day);
  if (date instanceof Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  return null;
};

export const calculateOccurrenceTop = ({
  hours,
  minutes,
}: {
  hours: number;
  minutes: number;
}): number => {
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
  return Math.round(yPosition / PIXELS_PER_15_MINUTES) - 1;
};

export const getDateFromSnapIndex = ({
  snapIndex,
  date,
}: {
  snapIndex: number;
  date: Date;
}): Date => {
  const minutes = snapIndex * 15;
  const currentDate = new Date(date);
  const snapDate = add(currentDate, { minutes });

  return snapDate;
};

export const DEFAULT_EVENT_COLOR = "tangerine";

export const CALENDAR_EVENT_COLORS_ARRAY = [
  // Neutrals (hue 0° or near-neutral)
  {
    id: "stone",
    name: "Stone",
    className: "bg-custom-stone-bg border-custom-stone-bg-shade ",
  },
  {
    id: "slate",
    name: "Slate",
    className: "bg-custom-slate-bg border-custom-slate-bg-shade",
  },
  {
    id: "neutral",
    name: "Neutral",
    className: "bg-custom-neutral-bg border-custom-neutral-bg-shade ",
  },
  // Warm → Cool progression
  {
    id: "tangerine",
    name: "Tangerine",
    className: "bg-custom-tangerine-bg border-custom-tangerine-bg-shade ",
  },
  {
    id: "sunshine",
    name: "Sunshine",
    className: "bg-custom-sunshine-bg border-custom-sunshine-bg-shade ",
  },
  {
    id: "banana",
    name: "Banana",
    className: "bg-custom-banana-bg border-custom-banana-bg-shade ",
  },
  {
    id: "sage",
    name: "Sage",
    className: "bg-custom-sage-bg border-custom-sage-bg-shade ",
  },
  {
    id: "peacock",
    name: "Peacock",
    className: "bg-custom-peacock-bg border-custom-peacock-bg-shade ",
  },
  {
    id: "graphite",
    name: "Graphite",
    className: "bg-custom-graphite-bg border-custom-graphite-bg-shade ",
  },
  {
    id: "blueberry",
    name: "Blueberry",
    className: "bg-custom-blueberry-bg border-custom-blueberry-bg-shade ",
  },
  {
    id: "lavender",
    name: "Lavender",
    className: "bg-custom-lavender-bg border-custom-lavender-bg-shade ",
  },
  {
    id: "grape",
    name: "Grape",
    className: "bg-custom-grape-bg border-custom-grape-bg-shade ",
  },
];

export const CALENDAR_EVENT_COLORS_MAP = new Map(
  CALENDAR_EVENT_COLORS_ARRAY.map((color) => [color.id, color]),
);

export const getCalendarColor = (color?: string) =>
  CALENDAR_EVENT_COLORS_MAP.get(color || "") ??
  CALENDAR_EVENT_COLORS_MAP.get(DEFAULT_EVENT_COLOR);

/**
 * Calculate the exact date range needed to display a month view grid
 * Returns start and end dates that form complete calendar weeks
 */
export const getMonthViewDateRange = (
  centerDate: Temporal.PlainDate,
): {
  start: Temporal.PlainDate;
  end: Temporal.PlainDate;
} => {
  // Get first day of the month
  const firstDayOfMonth = centerDate.with({ day: 1 });

  // Get the day of week for the first day (1-7, where 1 is Monday and 7 is Sunday)
  const firstDayOfWeek = firstDayOfMonth.dayOfWeek;

  // Calculate how many days to go back to reach the previous Monday
  const daysToSubtract = firstDayOfWeek === 1 ? 0 : firstDayOfWeek - 1;

  // Start from the Monday before or on the first day of the month
  const start = firstDayOfMonth.subtract({ days: daysToSubtract });

  // Get the last day of the month
  const lastDayOfMonth = firstDayOfMonth
    .add({ months: 1 })
    .subtract({ days: 1 });

  // Get the day of week for the last day
  const lastDayOfWeek = lastDayOfMonth.dayOfWeek;

  // Calculate how many days to add to reach the next Sunday
  const daysToAdd = lastDayOfWeek === 7 ? 0 : 7 - lastDayOfWeek;

  // End on the Sunday after or on the last day of the month
  let end = lastDayOfMonth.add({ days: daysToAdd });

  // Calculate total days to ensure we have complete weeks (multiple of 7)
  const totalDays =
    Temporal.PlainDate.compare(start, end) === 0
      ? 1
      : Temporal.Duration.from(start.until(end)).days + 1;

  // If not a multiple of 7, add more days to make complete weeks
  if (totalDays % 7 !== 0) {
    const additionalDays = 7 - (totalDays % 7);
    end = end.add({ days: additionalDays });
  }

  return { start, end };
};

export const getCurrentTimezone = () => {
  const instant = Temporal.Now.instant();
  const timezoneId = Temporal.Now.timeZoneId();
  const timezone = Temporal.TimeZone.from(timezoneId);

  const offsetNs = timezone.getOffsetNanosecondsFor(instant);
  const offsetHours = offsetNs / 3_600_000_000_000; // 1 hour = 3.6e+12 ns
  const offsetString = `${Math.floor(offsetHours)}:${String(Math.abs((offsetNs % 3_600_000_000_000) / 60_000_000_000)).padStart(2, "0")}`;

  return {
    id: timezoneId,
    offsetHours,
    offsetString,
  };
};
