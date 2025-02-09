import {
  SerializedOccurrenceFormSchema,
  SessionOcurrenceFormSchema,
} from "@/components/portal/calendar/occurrence-form-sheet/schema";
import {
  createDateFromParts,
  prepareEventAndOccurrencesForDatabase,
} from "@/components/portal/calendar/occurrence-form-sheet/utils";
import { getHubsByUserId } from "@/data-access/hub";
import { db } from "@/db";
import {
  type Event,
  Occurrence,
  event,
  event as eventDb,
  eventOccurrence,
} from "@/db/schema";
import type { CalendarEventOccurrence } from "@/stores/calendar-store";
import { SQL, and, asc, eq, getTableColumns, sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { z } from "zod";
import { PublicError } from "./errors";

const buildConflictUpdateColumns = <
  T extends PgTable,
  Q extends keyof T["_"]["columns"],
>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);
  return columns.reduce(
    (acc, column) => {
      const colName = cls?.[column]?.name;
      acc[column] = sql.raw(`excluded.${colName}`);
      return acc;
    },
    {} as Record<Q, SQL>,
  );
};

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

  const occurrencesMap = new Map<number, Occurrence>();
  const eventsMap = new Map<number, Event>();

  result.forEach((record) => {
    eventsMap.set(record.event.id, record.event);
    if (record.event_occurrence) {
      occurrencesMap.set(record.event_occurrence.id, record.event_occurrence);
    }
    const event = record.event;
    const eventOccurrence = record?.event_occurrence;
    if (!eventOccurrence) return;

    const mapHasEventOccurrence = eventOccurrencesMap.get(eventOccurrence.id);
    if (mapHasEventOccurrence) return;

    eventOccurrencesMap.set(eventOccurrence.id, {
      ...event,
      eventId: event.id,
      eventOccurrenceId: eventOccurrence.id,
      startTime: new Date(`${eventOccurrence.startTime}Z`),
      endTime: new Date(`${eventOccurrence.endTime}Z`),
      title: eventOccurrence.overrides?.title || event.title,
      description: eventOccurrence.overrides?.description || event.description,
      timezone: eventOccurrence.overrides?.timezone || event.timezone,
      price: eventOccurrence.overrides?.price || event.price,
      isDraft: false,
    });
  });

  const eventOcurrences = Object.fromEntries(eventOccurrencesMap.entries());

  const events = Object.fromEntries(eventsMap.entries());
  const occurrences = Object.fromEntries(occurrencesMap.entries());

  return {
    hubs,
    eventOcurrences: eventOcurrences,
    events,
    occurrences,
  };
};

export const createEventUseCase = async ({
  userId,
  formData,
}: {
  userId: string;
  formData: z.infer<typeof SessionOcurrenceFormSchema>;
}) => {
  const { event, occurrences } =
    prepareEventAndOccurrencesForDatabase(formData);

  return await db.transaction(async (trx) => {
    const [createdEvent] = await trx
      .insert(eventDb)
      .values({ userId, ...event })
      .returning();

    if (!createdEvent) {
      throw new PublicError("Failed to create event");
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

export const editNonRecurrentEventUseCase = async ({
  eventId,
  occurrenceId,
  formData,
}: {
  eventId: number;
  occurrenceId: number;
  formData: Partial<z.infer<typeof SerializedOccurrenceFormSchema>>;
}) => {
  const [toEditEvent] = await db
    .select({
      isRecurring: eventDb.isRecurring,
      startTime: eventDb.startTime,
      endTime: eventDb.endTime,
    })
    .from(eventDb)
    .where(eq(eventDb.id, eventId))
    .execute();

  if (!toEditEvent) {
    throw new PublicError("Event not found");
  }

  if (toEditEvent.isRecurring === true) {
    throw new PublicError("Cannot edit event. It is a recurring event!");
  }

  const {
    date: formDate,
    startTime: formStartTime,
    endTime: formEndTime,
    participants,
    ...restFormData
  } = formData;

  const originalStartTimeDater = new Date(toEditEvent.startTime);
  const originalEndTimeDater = new Date(toEditEvent.endTime);

  const startTime =
    formDate || formStartTime
      ? createDateFromParts(
          formDate ?? {
            year: originalStartTimeDater.getFullYear(),
            month: originalStartTimeDater.getMonth() + 1,
            day: originalStartTimeDater.getDate(),
          },
          formStartTime ?? {
            hour: originalStartTimeDater.getHours(),
            minute: originalStartTimeDater.getMinutes(),
          },
        )
      : undefined;

  const endTime =
    formDate || formEndTime
      ? createDateFromParts(
          formDate ?? {
            year: originalStartTimeDater.getFullYear(),
            month: originalStartTimeDater.getMonth() + 1,
            day: originalStartTimeDater.getDate(),
          },
          formEndTime ?? {
            hour: originalEndTimeDater.getHours(),
            minute: originalEndTimeDater.getMinutes(),
          },
        )
      : undefined;

  console.log({
    startTime,
    endTime,
  });

  const updateStartOrEndTime = Boolean(endTime || startTime);

  return await db.transaction(async (trx) => {
    const updateEvent = trx
      .update(eventDb)
      .set({ startTime, endTime, ...restFormData })
      .where(eq(eventDb.id, eventId))
      .returning();

    const updateOccurrence = updateStartOrEndTime
      ? trx
          .update(eventOccurrence)
          .set({ startTime, endTime })
          .where(eq(eventOccurrence.eventId, eventId))
          .returning()
      : null;

    const [[updatedEvent], updatedOccurrences] = await Promise.all([
      updateEvent.execute(),
      ...(updateOccurrence ? [updateOccurrence.execute()] : []),
    ]);

    if (
      !updatedEvent ||
      (updateStartOrEndTime && !updatedOccurrences?.length)
    ) {
      throw new PublicError("Failed to edit event");
    }

    return {
      updatedEvent,
      updatedOccurrences,
    };
  });
};
