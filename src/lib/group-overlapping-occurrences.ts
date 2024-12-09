import { type CalendarDateTime, parseDateTime } from "@internationalized/date";
import { format } from "date-fns";
import type { SessionOccurrence } from "./generate-session-ocurrences";

export const groupOverlappingOccurrences = (sessions: SessionOccurrence[]) => {
  const parsedSessions = sessions.map((session) => ({
    ...session,
    startTime: parseDateTime(session.startTime),
    endTime: parseDateTime(session.endTime),
  }));

  parsedSessions.sort((a, b) => a.startTime.compare(b.startTime));

  const sessionGroups: SessionOccurrence[][] = [];
  let currentGroup: SessionOccurrence[] = [];
  let currentRange: [CalendarDateTime, CalendarDateTime] | null = null;

  for (const session of parsedSessions) {
    if (!currentGroup.length) {
      currentGroup.push({
        ...session,
        startTime: session.startTime.toString(),
        endTime: session.endTime.toString(),
      });
      currentRange = [session.startTime, session.endTime];
    } else {
      if (session.startTime.compare(currentRange![1]) <= 0) {
        currentGroup.push({
          ...session,
          startTime: session.startTime.toString(),
          endTime: session.endTime.toString(),
        });

        currentRange = [
          currentRange![0].compare(session.startTime) < 0
            ? currentRange![0]
            : session.startTime,
          currentRange![1].compare(session.endTime) > 0
            ? currentRange![1]
            : session.endTime,
        ];
      } else {
        sessionGroups.push(currentGroup);
        currentGroup = [
          {
            ...session,
            startTime: session.startTime.toString(),
            endTime: session.endTime.toString(),
          },
        ];
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
  console.log({ groupedSessions });

  return groupedSessions;
};
