import type { getCalendarSessionsByDateRange } from "@/data-access/sessions/queries";

export type CalendarView = "day" | "weekday" | "week" | "month" | "agenda";

export type CalendarSession = Awaited<
  ReturnType<typeof getCalendarSessionsByDateRange>
>[number];

export type LayoutCalendarSession = CalendarSession & {
  columnIndex: number;
  totalColumns: number;
};

export type TimeBoundary = {
  time: number;
  type: "start" | "end";
  sessionId: number;
};
