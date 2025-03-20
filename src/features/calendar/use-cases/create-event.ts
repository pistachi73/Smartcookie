import { db } from "@/db";
import { event as eventDb, eventOccurrence } from "@/db/schema";
import { PublicError } from "@/shared/services/errors";
import type { z } from "zod";
import { prepareEventAndOccurrencesForDatabase } from "../components/occurrence-form-sheet/utils";
import type { OccurrenceFormSchema } from "../types/occurrence-form-schema";

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
