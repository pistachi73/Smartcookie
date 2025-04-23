import memoize from "lodash/memoize";
import type { LayoutCalendarSession } from "../types/calendar.types";
import { getDayKeyFromDateString } from "./utils";

/**
 * Organizes calendar sessions by day
 */
export const organizeSessionsByDay = memoize(
  (
    layoutSessions: LayoutCalendarSession[],
  ): Record<string, LayoutCalendarSession[]> => {
    const byDay: Record<string, LayoutCalendarSession[]> = {};

    if (!layoutSessions.length) return byDay;

    // Fill in sessions for each day
    layoutSessions.forEach((session) => {
      const dateKey = getDayKeyFromDateString(session.startTime);

      if (dateKey) {
        if (!byDay[dateKey]) {
          byDay[dateKey] = [];
        }
        byDay[dateKey].push(session);
      }
    });

    return byDay;
  },
  (layoutSessions: LayoutCalendarSession[]) =>
    JSON.stringify(
      [...new Set(layoutSessions.map((session) => session.id))].sort(),
    ),
);
