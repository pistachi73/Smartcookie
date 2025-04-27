import type { Event, Occurrence } from "@/db/schema";
import type { Temporal } from "temporal-polyfill";
import type { getCalendarSessionsByDateRange } from "../use-cases/calendar.use-case";

export type CalendarView = "day" | "weekday" | "week" | "month" | "agenda";

export type CalendarSession = Awaited<
  ReturnType<typeof getCalendarSessionsByDateRange>
>[number];

export type DatedCalendarSession = Omit<
  CalendarSession,
  "startTime" | "endTime"
> & {
  startTime: Temporal.ZonedDateTime;
  endTime: Temporal.ZonedDateTime;
};

export type DatedOccurrence = Omit<Occurrence, "startTime" | "endTime"> & {
  startTime: Temporal.ZonedDateTime;
  endTime: Temporal.ZonedDateTime;
};

export type LayoutCalendarSession = CalendarSession & {
  columnIndex: number;
  totalColumns: number;
};

export type TimeBoundary = {
  time: number;
  type: "start" | "end";
  sessionId: number;
};

export type DailySessions = Map<string, LayoutCalendarSession[]>;

export type UIOccurrence = Omit<
  Event,
  "id" | "startTime" | "endTime" | "userId"
> & {
  eventId: number;
  occurrenceId: number;
  startTime: Date;
  endTime: Date;
};
