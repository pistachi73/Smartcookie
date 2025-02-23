import type { Event, Occurrence } from "@/db/schema";
import type { Temporal } from "@js-temporal/polyfill";

export type CalendarView = "day" | "weekday" | "week" | "month" | "agenda";

export type DatedOccurrence = Omit<Occurrence, "startTime" | "endTime"> & {
  startTime: Temporal.ZonedDateTime;
  endTime: Temporal.ZonedDateTime;
};

export type OccurrenceGridPosition = {
  occurrenceId: number;
  columnIndex: number;
  totalColumns: number;
};

export type TimeBoundary = {
  time: number;
  type: "start" | "end";
  occurrenceId: number;
};

export type DailyOccurrences = Map<string, OccurrenceGridPosition[]>;

export type MergedOccurrence = Omit<
  Event,
  "id" | "startTime" | "endTime" | "userId"
> & {
  eventId: number;
  occurrenceId: number;
  startTime: Temporal.ZonedDateTime;
  endTime: Temporal.ZonedDateTime;
  userId?: string;
};
