import type { RecurrenceRuleFrequency, Session } from "@/db/schema/session";
import type { SessionException } from "@/db/schema/session-exception";
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  isWithinInterval,
} from "date-fns";
import type { DayOfWeek } from "../db/schema/session";

export const generateSessionOccurrences = ({
  session,
  exceptions,
  startDate,
  endDate,
}: {
  session: Session;
  exceptions: SessionException[];
  startDate: Date;
  endDate: Date;
}): Session[] => {
  if (!session.isRecurring) {
    return singleOccurrenceWithinRange(session, startDate, endDate);
  }

  if (!session.recurrenceRule) return [];

  const exceptionMap = mapSessionExceptions(exceptions);
  const { frequency, interval, daysOfWeek } = session.recurrenceRule;
  const occurrences: Session[] = [];
  let currentDate = new Date(session.startTime);
  const sessionDuration =
    new Date(session.endTime).getTime() - currentDate.getTime();

  while (currentDate <= endDate) {
    const key = getSessionExceptionKey(session.id, currentDate);
    if (!exceptionMap.has(key)) {
      occurrences.push(
        cloneSessionWithNewDate(session, currentDate, sessionDuration),
      );
    }

    currentDate = incrementDate(currentDate, frequency, interval);
  }

  return occurrences.filter((occurrence) =>
    isWithinInterval(occurrence.startTime, { start: startDate, end: endDate }),
  );
};

const singleOccurrenceWithinRange = (
  session: Session,
  startDate: Date,
  endDate: Date,
): Session[] => {
  const sessionDate = new Date(session.startTime);
  return isWithinInterval(sessionDate, { start: startDate, end: endDate })
    ? [session]
    : [];
};

const cloneSessionWithNewDate = (
  session: Session,
  newStartDate: Date,
  sessionDuration: number,
): Session => {
  return {
    ...session,
    startTime: newStartDate,
    endTime: new Date(newStartDate.getTime() + sessionDuration),
  };
};

const matchesRecurrenceRule = (
  date: Date,
  daysOfWeek: DayOfWeek[],
): boolean => {
  return daysOfWeek.includes(format(date, "EEEEEE") as DayOfWeek);
};

const incrementDate = (
  date: Date,
  frequency: RecurrenceRuleFrequency,
  interval: number,
): Date => {
  switch (frequency) {
    case "daily":
      return addDays(date, interval);
    case "weekly":
      return addWeeks(date, interval);
    case "monthly":
      return addMonths(date, interval);
    default:
      throw new Error(`Unsupported frequency: ${frequency}`);
  }
};

const getSessionExceptionKey = (sessionId: number, date: Date): string => {
  return `${sessionId}-${format(date, "yyyy-MM-dd")}`;
};

const mapSessionExceptions = (
  exceptions: SessionException[],
): Map<string, SessionException> => {
  return exceptions.reduce((map, exception) => {
    map.set(
      getSessionExceptionKey(exception.sessionId, exception.exceptionDate),
      exception,
    );
    return map;
  }, new Map<string, SessionException>());
};
