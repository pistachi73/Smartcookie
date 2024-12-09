import type { RecurrenceRuleDbSchema, Session } from "@/db/schema/session";
import type {
  SessionException,
  SessionExceptionReason,
} from "@/db/schema/session-exception";
import { type CalendarDateTime, parseDateTime } from "@internationalized/date";

export type SessionOccurrence = Session & {
  exceptionReason?: SessionExceptionReason;
};

export const generateSessionOccurrences = ({
  session,
  startDate,
  endDate,
}: {
  session: Session;
  startDate?: CalendarDateTime;
  endDate?: CalendarDateTime;
}): SessionOccurrence[] => {
  const { exceptions, ...sessionWithoutExceptions } = session;
  const exceptionMap = mapSessionExceptions(exceptions ?? []);
  let currentDate = parseDateTime(session.startTime);

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

    console.log({ occurrence });

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

  console.log({ recurrenceEndDate, start: session.startTime, sessionDuration });

  const parsedRecurrenceEndDate = parseDateTime(recurrenceEndDate);
  const occurrences: SessionOccurrence[] = [];

  while (currentDate.compare(parsedRecurrenceEndDate) <= 0) {
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
  currentDate: CalendarDateTime;
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
        startTime: currentDate.toString(),
        endTime: currentDate.add({ milliseconds: sessionDuration }).toString(),
        exceptionReason: exception?.reason,
      };
    }
  }
}

const filterOccurrencesWithinRange =
  (startDate: CalendarDateTime, endDate: CalendarDateTime) =>
  (occurrence: SessionOccurrence) => {
    const ocurrenceParsedStartDate = parseDateTime(occurrence.startTime);
    const ocurrenceParsedEndDate = parseDateTime(occurrence.endTime);

    return (
      ocurrenceParsedStartDate.compare(startDate) <= 0 &&
      ocurrenceParsedEndDate.compare(endDate) >= 0
    );
  };

export const incrementDate = (
  date: CalendarDateTime,
  frequency: RecurrenceRuleDbSchema["frequency"],
  interval: number,
): CalendarDateTime => {
  switch (frequency) {
    case "daily":
      return date.add({ days: interval });
    case "weekly":
      return date.add({ weeks: interval });
    default:
      throw new Error(`Unsupported frequency: ${frequency}`);
  }
};

const getSessionExceptionKey = (
  sessionId: number,
  date: CalendarDateTime,
): string => {
  return `${sessionId}-${date.year}-${date.month}-${date.day}`;
};

const mapSessionExceptions = (
  exceptions: SessionException[],
): Map<string, SessionException> =>
  exceptions.reduce((map, exception) => {
    map.set(
      getSessionExceptionKey(
        exception.sessionId,
        parseDateTime(exception.exceptionDate),
      ),
      exception,
    );
    return map;
  }, new Map<string, SessionException>());
