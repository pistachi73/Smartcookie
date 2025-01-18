import { getCalendarHubsByUserId, getHubsByUserId } from "@/data-access/hub";
import { db } from "@/db";
import { event, eventOccurrence } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import type { EventOccurrence } from "../db/schema/event";

export const getCalendarDataUseCase = async (userId: string) => {
  const [hubs, result] = await Promise.all([
    getHubsByUserId(userId),
    await db
      .select()
      .from(event)
      .leftJoin(eventOccurrence, eq(eventOccurrence.eventId, event.id))
      .where(
        and(
          eq(event.userId, userId),
          // between(EventOccurrences.occurrenceStart, startDate, endDate),
        ),
      )
      .orderBy(asc(event.id), asc(event.startTime))
      .execute(),
  ]);

  const eventOccurrencesMap = new Map<number, EventOccurrence>();

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
      startTime: new Date(eventOccurrence.startTime),
      endTime: new Date(eventOccurrence.endTime),
      title: eventOccurrence.overrides?.title || event.title,
      description: eventOccurrence.overrides?.description || event.description,
      isRecurring: event.isRecurring,
      recurrenceRule: event.recurrenceRule,
      timezone: eventOccurrence.overrides?.timezone || event.timezone,
      price: eventOccurrence.overrides?.price || event.price,
    });
  });

  // const eventOccurrencesMap = Array.from(eventOccurrencesMap.values());
  const eventOcurrences = Object.fromEntries(eventOccurrencesMap.entries());

  // const groupedEventOccurrences =
  //   groupEventOccurrencesByDayAndTime(eventOccurrences);

  return {
    hubs,
    eventOcurrences: eventOcurrences,
  };
};
export const getCalendarHubsByUserIdUseCase = async (userId: string) => {
  const hubs = await getCalendarHubsByUserId(userId);

  hubs.forEach((hub) => {
    console.log({ hub });
    hub.sessions.forEach((session) => {
      console.log({ session });
      session.occurrences?.forEach((occurrence) => {
        console.log({ occurrence });
      });
    });
  });

  // console.time("getCalendarHubsByUserIdUseCase");

  // const sessions = hubs.reduce<Session[]>((acc, hub) => {
  //   acc.push(...hub.sessions);
  //   return acc;
  // }, []);

  // const sessionOcurrences = sessions.flatMap((session) =>
  //   generateSessionOccurrences({ session }),
  // );
  // // console.log({ sessionOcurrences });

  // const groupedSessionOccurrences =
  //   groupOccurrencesByDayAndTime(sessionOcurrences);
  // console.timeEnd("getCalendarHubsByUserIdUseCase");

  return {
    hubs: null,
    sessionOccurrences: null,
  };
};
