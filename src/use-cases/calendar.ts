import { getHubsByUserId } from "@/data-access/hub";
import { db } from "@/db";
import {
  type InsertEvent,
  type InsertEventOccurrence,
  event,
  event as eventDb,
  eventOccurrence,
} from "@/db/schema";
import type { CalendarEventOccurrence } from "@/stores/calendar-store";
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

  const eventOccurrencesMap = new Map<number, CalendarEventOccurrence>();

  result.forEach((record) => {
    const event = record.event;
    const eventOccurrence = record?.event_occurrence;
    if (!eventOccurrence) return;

    const mapHasEventOccurrence = eventOccurrencesMap.get(eventOccurrence.id);
    if (mapHasEventOccurrence) return;

    eventOccurrencesMap.set(eventOccurrence.id, {
      hubId: event.hubId,
      eventId: event.id,
      eventOccurrenceId: eventOccurrence.id,
      userId: event.userId,
      startTime: new Date(`${eventOccurrence.startTime}Z`),
      endTime: new Date(`${eventOccurrence.endTime}Z`),
      title: eventOccurrence.overrides?.title || event.title,
      description: eventOccurrence.overrides?.description || event.description,
      isRecurring: event.isRecurring,
      recurrenceRule: event.recurrenceRule,
      timezone: eventOccurrence.overrides?.timezone || event.timezone,
      price: eventOccurrence.overrides?.price || event.price,
      isDraft: false,
    });
  });

  const eventOcurrences = Object.fromEntries(eventOccurrencesMap.entries());

  return {
    hubs,
    eventOcurrences: eventOcurrences,
  };
};

export const createEventUseCase = async ({
  userId,
  event,
  occurrences,
}: {
  userId: string;
  event: Omit<InsertEvent, "userId">;
  occurrences: Omit<InsertEventOccurrence, "eventId">[];
}) => {
  return await db.transaction(async (trx) => {
    const [createdEvent] = await trx
      .insert(eventDb)
      .values({ userId, ...event })
      .returning();

    if (!createdEvent) {
      trx.rollback();
      return;
    }

    const createdEventId = createdEvent.id;
    const occurrencesWithEventId = occurrences.map((occurrence) => ({
      ...occurrence,
      eventId: createdEventId,
    }));

    const createdOccurrences = await trx
      .insert(eventOccurrence)
      .values(occurrencesWithEventId)
      .returning();

    return {
      createdEvent,
      createdOccurrences,
    };
  });
};
