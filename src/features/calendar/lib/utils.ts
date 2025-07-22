import { CalendarDate, CalendarDateTime, Time } from "@internationalized/date";
import { add, addDays, endOfWeek, format, startOfWeek } from "date-fns";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { Temporal } from "temporal-polyfill";
import type { z } from "zod";

import type {
  CalendarView,
  DatedOccurrence,
} from "@/features/calendar/types/calendar.types";
import type { OccurrenceFormSchema } from "@/features/calendar/types/occurrence-form-schema";

export const ROW_HEIGHT = 72;
export const TIMESLOT_HEIGHT = ROW_HEIGHT / 4;
const CALENDAR_START_HOUR = 0; // Adjust based on your calendar's start hour
const CALENDAR_END_HOUR = 24; // Adjust based on your calendar's end hour
const TOTAL_MINUTES = (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * 60;
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

export const generateOccurrenceEncodedOverrides = ({
  timeslotPosition,
  date,
}: {
  timeslotPosition: number;
  date: Date;
}) => {
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

const parseDateTimeString = (str?: string) => {
  if (!str) return undefined;

  // Use regex with named capture groups for better type safety
  const match = str.match(
    /^(?<year>\d{4})(?<month>\d{2})(?<day>\d{2})T(?<hour>\d{2})(?<minute>\d{2})/,
  );

  if (!match?.groups) return undefined;

  // Type guard for parsed values
  const { year, month, day, hour, minute } = match.groups;
  if (!year || !month || !day || !hour || !minute) return undefined;

  return {
    year: Number.parseInt(year, 10),
    month: Number.parseInt(month, 10),
    day: Number.parseInt(day, 10),
    hour: Number.parseInt(hour, 10),
    minute: Number.parseInt(minute, 10),
  };
};

export const consumeOccurrenceOverrides = (
  searchParams: ReadonlyURLSearchParams,
): Partial<z.infer<typeof OccurrenceFormSchema>> | undefined => {
  const encodedOverrides = searchParams.get("overrides");
  if (!encodedOverrides) return;

  try {
    const overridesArray: string[] = JSON.parse(
      decodeURIComponent(encodedOverrides),
    );

    const [startDateString, endDateString] = overridesArray;
    const [startDate, endDate] = [
      parseDateTimeString(startDateString),
      parseDateTimeString(endDateString),
    ];

    const date =
      startDate?.year && startDate.month && startDate.day
        ? new CalendarDate(startDate.year, startDate.month, startDate.day)
        : undefined;

    const startTime =
      startDate?.hour !== undefined && startDate?.minute !== undefined
        ? new Time(startDate.hour, startDate.minute)
        : undefined;

    const endTime =
      endDate?.hour !== undefined && endDate?.minute !== undefined
        ? new Time(endDate.hour, endDate.minute)
        : undefined;

    return {
      date,
      startTime,
      endTime,
    };
  } catch (error) {
    console.error("Error parsing occurrence overrides:", error);
    return;
  }
};

export const generateOccurrenceOverrides = (
  draftOccurrence: DatedOccurrence,
) => {
  const formattedStartTime = draftOccurrence.startTime
    .toPlainDateTime()
    .toString({
      calendarName: "never",
      fractionalSecondDigits: 0,
    })
    .replace(/[-:]/g, "");

  const formattedEndTime = draftOccurrence.endTime
    .toPlainDateTime()
    .toString({
      calendarName: "never",
      fractionalSecondDigits: 0,
    })
    .replace(/[-:]/g, "");

  const overrides = [formattedStartTime, formattedEndTime];
  const params = new URLSearchParams({
    overrides: encodeURIComponent(JSON.stringify(overrides)),
  });

  return params.toString();
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
  return Math.round(yPosition / PIXELS_PER_15_MINUTES);
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
