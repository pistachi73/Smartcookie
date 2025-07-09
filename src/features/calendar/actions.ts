"use server";

import { protectedAction } from "@/shared/lib/safe-action";
import { z } from "zod";
import {
  type OccurrenceFormSchema,
  SerializedOccurrenceFormSchema,
} from "./types/occurrence-form-schema";
import { createEventUseCase, editNonRecurrentEventUseCase } from "./use-cases";

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

export const createEventAction = protectedAction
  .schema(
    z.object({
      formData: SerializedOccurrenceFormSchema,
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    return await createEventUseCase({
      userId: ctx.user.id,
      formData: parsedInput.formData as z.infer<typeof OccurrenceFormSchema>,
    });
  });
