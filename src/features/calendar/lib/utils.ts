import type {
  CalendarView,
  DatedOccurrence,
} from "@/features/calendar/types/calendar.types";
import type { OccurrenceFormSchema } from "@/features/calendar/types/occurrence-form-schema";
import { getEndOfWeek, getStartOfWeek } from "@/shared/lib/temporal/week";
import { CalendarDate, CalendarDateTime, Time } from "@internationalized/date";
import { add } from "date-fns";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { Temporal } from "temporal-polyfill";
import type { z } from "zod";

export const ROW_HEIGHT = 48;
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
  // Common format options
  const formatOptions = {
    day: { day: "numeric" } as const,
    month: { month: "long" } as const,
    year: { year: "numeric" } as const,
  };

  // Format date parts
  const formatDate = (date: Temporal.PlainDate) => ({
    day: date.toLocaleString("en-US", formatOptions.day),
    month: date.toLocaleString("en-US", formatOptions.month),
    year: date.toLocaleString("en-US", formatOptions.year),
  });

  const { day, month, year } = formatDate(date);

  switch (calendarType) {
    case "day":
      return `${day} ${month}, ${year}`;

    case "week": {
      const startOfWeek = getStartOfWeek(date);
      const endOfWeek = getEndOfWeek(date);
      const startDate = formatDate(startOfWeek);
      const endDate = formatDate(endOfWeek);

      return `${startDate.day} ${startDate.month} - ${endDate.day} ${endDate.month}, ${year}`;
    }

    case "month":
      return `${month} ${year}`;

    case "agenda": {
      const rangeEndDate = date.add({ days: 14 });

      // If same month, just show one month
      if (date.month === rangeEndDate.month) {
        return `${month} ${year}`;
      }

      const endDateFormat = formatDate(rangeEndDate);
      return `${month} ${year} - ${endDateFormat.month} ${endDateFormat.year}`;
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

export const DEFAULT_EVENT_COLOR = "tangerine";

export const CALENDAR_EVENT_COLORS_ARRAY = [
  // Neutrals (hue 0° or near-neutral)
  {
    id: "stone",
    name: "Stone",
    className: "bg-event-stone-bg border-event-stone-border ",
  },
  {
    id: "slate",
    name: "Slate",
    className: "bg-event-slate-bg border-event-slate-border ",
  },
  {
    id: "neutral",
    name: "Neutral",
    className: "bg-event-neutral-bg border-event-neutral-border ",
  },
  // Warm → Cool progression
  {
    id: "tangerine",
    name: "Tangerine",
    className: "bg-event-tangerine-bg border-event-tangerine-border ",
  },
  {
    id: "sunshine",
    name: "Sunshine",
    className: "bg-event-sunshine-bg border-event-sunshine-border ",
  },
  {
    id: "banana",
    name: "Banana",
    className: "bg-event-banana-bg border-event-banana-border ",
  },
  {
    id: "sage",
    name: "Sage",
    className: "bg-event-sage-bg border-event-sage-border ",
  },
  {
    id: "peacock",
    name: "Peacock",
    className: "bg-event-peacock-bg border-event-peacock-border ",
  },
  {
    id: "graphite",
    name: "Graphite",
    className: "bg-event-graphite-bg border-event-graphite-border ",
  },
  {
    id: "blueberry",
    name: "Blueberry",
    className: "bg-event-blueberry-bg border-event-blueberry-border ",
  },
  {
    id: "lavender",
    name: "Lavender",
    className: "bg-event-lavender-bg border-event-lavender-border ",
  },
  {
    id: "grape",
    name: "Grape",
    className: "bg-event-grape-bg border-event-grape-border ",
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
