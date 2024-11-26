import { format } from "date-fns";
import type { SessionOccurrence } from "./generate-session-ocurrences";

export const groupOverlappingOccurrences = (sessions: SessionOccurrence[]) => {
  sessions.map((session) => ({
    ...session,
    startTime: new Date(session.startTime),
    endTime: new Date(session.endTime),
  }));

  sessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const sessionGroups: SessionOccurrence[][] = [];
  let currentGroup: SessionOccurrence[] = [];
  let currentRange: [Date, Date] | null = null;

  for (const session of sessions) {
    if (!currentGroup.length) {
      currentGroup.push(session);
      currentRange = [session.startTime, session.endTime];
    } else {
      if (session.startTime <= currentRange![1]) {
        currentGroup.push(session);
        currentRange = [
          new Date(
            Math.min(currentRange![0].getTime(), session.startTime.getTime()),
          ),
          new Date(
            Math.max(currentRange![1].getTime(), session.endTime.getTime()),
          ),
        ];
      } else {
        sessionGroups.push(currentGroup);
        currentGroup = [session];
        currentRange = [session.startTime, session.endTime];
      }
    }
  }

  if (currentGroup.length) {
    sessionGroups.push(currentGroup);
  }

  return sessionGroups;
};

export type DayGroupedSessionOccurrences = Record<
  string,
  SessionOccurrence[][]
>;

export const groupOccurrencesByDayAndTime = (
  sessionOccurrences: SessionOccurrence[],
) => {
  const sessionOccurrencesByDay = sessionOccurrences.reduce<
    Record<string, SessionOccurrence[]>
  >((acc, occurrence) => {
    const dayKey = format(occurrence.startTime, "yyyy-MM-dd");
    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }
    acc[dayKey].push(occurrence);
    return acc;
  }, {});

  const groupedSessions = Object.entries(
    sessionOccurrencesByDay,
  ).reduce<DayGroupedSessionOccurrences>((acc, [day, daySessions]) => {
    acc[day] = groupOverlappingOccurrences(daySessions);
    return acc;
  }, {});

  return groupedSessions;
};
