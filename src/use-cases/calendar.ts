import type {
  OccurrenceFormSchema,
  SerializedOccurrenceFormSchema,
} from "@/components/portal/calendar/occurrence-form-sheet/schema";
import {
  createDateFromParts,
  prepareEventAndOccurrencesForDatabase,
} from "@/components/portal/calendar/occurrence-form-sheet/utils";
import { getHubsByUserId } from "@/data-access/hub";
import { db } from "@/db";
import {
  type Event,
  type Occurrence,
  event,
  event as eventDb,
  eventOccurrence,
} from "@/db/schema";
import { Temporal } from "@js-temporal/polyfill";
import { and, asc, eq } from "drizzle-orm";
import type { z } from "zod";
import { PublicError } from "./errors";

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
  const events: Event[] = [];

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
  });

  return {
    hubs,
    events,
    occurrences,
  };
};

export const createEventUseCase = async ({
  userId,
  formData,
}: {
  userId: string;
  formData: z.infer<typeof OccurrenceFormSchema>;
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
