import { getHubsByUserId } from "@/data-access/hub";
import { db } from "@/db";
import {
  type Event,
  type Occurrence,
  event,
  eventOccurrence,
} from "@/db/schema";
import { Temporal } from "@js-temporal/polyfill";
import { and, asc, eq } from "drizzle-orm";

export const getCalendarDataUseCase = async (userId: string) => {
  const [hubs, result] = await Promise.all([
    getHubsByUserId(userId),
    await db
      .select()
      .from(event)
      .leftJoin(eventOccurrence, eq(eventOccurrence.eventId, event.id))
      .where(
        and(
          // eq(event.userId, userId),
          // between(EventOccurrences.occurrenceStart, startDate, endDate),
        ),
      )
      .orderBy(asc(event.id), asc(event.startTime))
      .execute(),
  ]);

  const occurrences: Occurrence[] = [];
  const events: Map<number, Event> = new Map();

  result.forEach((record) => {
    const event = record.event;
    const occurrence = record.event_occurrence;
    if (occurrence) {
      const timezone = occurrence.overrides?.timezone || event.timezone;
      const startInstant = Temporal.Instant.from(occurrence.startTime);
      const endInstant = Temporal.Instant.from(occurrence.endTime);

      occurrences.push({
        ...occurrence,
        startTime: startInstant.toZonedDateTimeISO(timezone).toString({
          timeZoneName: "never",
        }),
        endTime: endInstant.toZonedDateTimeISO(timezone).toString({
          timeZoneName: "never",
        }),
      });
    }

    events.set(event.id, event);
  });

  return {
    hubs,
    events: Array.from(events.values()),
    occurrences,
  };
};
