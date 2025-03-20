import { db } from "@/db";
import { event as eventDb, eventOccurrence } from "@/db/schema";
import { PublicError } from "@/shared/services/errors";
import { eq } from "drizzle-orm";
import type { z } from "zod";
import { createDateFromParts } from "../components/occurrence-form-sheet/utils";
import type { SerializedOccurrenceFormSchema } from "../types/occurrence-form-schema";

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
