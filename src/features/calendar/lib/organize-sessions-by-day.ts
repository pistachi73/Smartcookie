import { getDayKeyFromDateString } from "./utils";

/**
 * Organizes calendar sessions by day
 */
export const organizeSessionsByDay = <
  T extends { startTime: string; id: number },
>(
  layoutSessions: T[],
): Record<string, T[]> => {
  const byDay: Record<string, T[]> = {};

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
};
