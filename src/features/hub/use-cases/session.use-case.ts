"use server";

import type { InsertSession } from "@/db/schema";
import { rrulestr } from "rrule";
import type { z } from "zod";
import type { AddSessionsUseCaseSchema } from "../lib/schemas";

export const addSessionUseCase = async (
  data: z.infer<typeof AddSessionsUseCaseSchema>,
) => {
  const { formData, hubEndsOn, userId } = data;
  const { date, startTime, endTime, rrule: rruleStr } = formData;

  const sessions: InsertSession[] = [];
  const durationInMinutes =
    (endTime.hour - startTime.hour) * 60 + endTime.minute - startTime.minute;

  const startDate = new Date(
    date.year,
    date.month - 1,
    date.day,
    startTime.hour,
    startTime.minute,
  );

  if (rruleStr && rruleStr !== "no-recurrence") {
    const rrule = rrulestr(rruleStr);
    console.log("hola");

    const dates = rrule.all();

    console.log({ dates });
  }

  console.log({ data });
};
