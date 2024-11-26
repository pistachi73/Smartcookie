import type { RecurrenceRuleFrequency, Session } from "@/db/schema/session";
import type {
  SessionException,
  SessionExceptionReason,
} from "@/db/schema/session-exception";
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  isWithinInterval,
} from "date-fns";

export type SessionOccurrence = Session & {
  exceptionReason?: SessionExceptionReason;
};

export const generateSessionOccurrences = ({
  session,
  startDate,
  endDate,
}: {
  session: Session;
  startDate?: Date;
  endDate?: Date;
}): SessionOccurrence[] => {
  const { exceptions, ...sessionWithoutExceptions } = session;
  const exceptionMap = mapSessionExceptions(session.exceptions ?? []);
  let currentDate = new Date(session.startTime);
  const sessionDuration =
    new Date(session.endTime).getTime() - new Date(session.startTime).getTime();

  if (!session.isRecurring) {
    const key = getSessionExceptionKey(session.id, currentDate);

    const occurrence = handleSessionException({
      exception: exceptionMap.get(key),
      sessionWithoutExceptions,
      currentDate,
      sessionDuration,
    });

    if (!occurrence) return [];

    if (startDate && endDate) {
      return [occurrence].filter(
        filterOccurrencesWithinRange(startDate, endDate),
      );
    }
    return [occurrence];
  }

  if (!session.recurrenceRule) return [];

  const {
    frequency,
    interval,
    endDate: recurrenceEndDate,
  } = session.recurrenceRule;

  const occurrences: SessionOccurrence[] = [];

  while (currentDate <= new Date(recurrenceEndDate)) {
    const key = getSessionExceptionKey(session.id, currentDate);

    const occurrence = handleSessionException({
      exception: exceptionMap.get(key),
      sessionWithoutExceptions,
      currentDate,
      sessionDuration,
    });

    if (occurrence) {
      occurrences.push(occurrence);
    }

    currentDate = incrementDate(currentDate, frequency, interval);
  }

  if (startDate && endDate) {
    return occurrences.filter(filterOccurrencesWithinRange(startDate, endDate));
  }

  return occurrences;
};

function handleSessionException({
  exception,
  sessionWithoutExceptions,
  currentDate,
  sessionDuration,
}: {
  exception?: SessionException;
  sessionWithoutExceptions: Session;
  currentDate: Date;
  sessionDuration: number;
}): SessionOccurrence | undefined {
  switch (exception?.reason) {
    case "skip":
      return undefined;
    case "reschedule": {
      const { newStartTime, newEndTime } = exception;
      if (!newStartTime || !newEndTime) return undefined;
      return {
        ...sessionWithoutExceptions,
        startTime: newStartTime,
        endTime: newEndTime,
        exceptionReason: exception?.reason,
      };
    }
    default: {
      return {
        ...sessionWithoutExceptions,
        startTime: currentDate,
        endTime: new Date(currentDate.getTime() + sessionDuration),
        exceptionReason: exception?.reason,
      };
    }
  }
}

const filterOccurrencesWithinRange =
  (startDate: Date, endDate: Date) => (occurrence: SessionOccurrence) =>
    isWithinInterval(occurrence.startTime, { start: startDate, end: endDate });

export const incrementDate = (
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
): Map<string, SessionException> =>
  exceptions.reduce((map, exception) => {
    map.set(
      getSessionExceptionKey(exception.sessionId, exception.exceptionDate),
      exception,
    );
    return map;
  }, new Map<string, SessionException>());
