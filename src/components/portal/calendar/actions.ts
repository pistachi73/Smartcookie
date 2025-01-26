"use server";

import type { InsertEvent, InsertEventOccurrence } from "@/db/schema";
import { protectedAction } from "@/lib/safe-action";
import {
  createEventUseCase,
  getCalendarDataUseCase,
} from "@/use-cases/calendar";
import { z } from "zod";

export const getCalendarDataAction = protectedAction.action(async ({ ctx }) => {
  const {
    user: { id },
  } = ctx;

  return await getCalendarDataUseCase(id);
});

export const createEventAction = protectedAction
  .schema(
    z.object({
      event: z.custom<Omit<InsertEvent, "userId">>(),
      occurrences: z.array(z.custom<Omit<InsertEventOccurrence, "eventId">>()),
    }),
  )
  .action(async ({ ctx, parsedInput: { event, occurrences } }) => {
    const {
      user: { id },
    } = ctx;

    return await createEventUseCase({ event, occurrences, userId: id });
  });
