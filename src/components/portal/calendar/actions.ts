"use server";

import { protectedAction } from "@/lib/safe-action";
import {
  createEventUseCase,
  editNonRecurrentEventUseCase,
  getCalendarDataUseCase,
} from "@/use-cases/calendar";
import { z } from "zod";
import { SerializedOccurrenceFormSchema } from "./occurrence-form-sheet/schema";

export const getCalendarDataAction = protectedAction.action(async ({ ctx }) => {
  const {
    user: { id },
  } = ctx;

  return await getCalendarDataUseCase(id);
});

export const createEventAction = protectedAction
  .schema(
    z.object({
      formData: SerializedOccurrenceFormSchema,
    }),
  )
  .action(async ({ ctx, parsedInput: { formData } }) => {
    const {
      user: { id },
    } = ctx;

    return await createEventUseCase({ formData, userId: id });
  });

export const editNonRecurrentEventAction = protectedAction
  .schema(
    z.object({
      eventId: z.number(),
      occurrenceId: z.number(),
      formData: SerializedOccurrenceFormSchema.partial(),
    }),
  )
  .action(async ({ parsedInput }) => {
    return await editNonRecurrentEventUseCase(parsedInput);
  });
