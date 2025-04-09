"use server";

import { db } from "@/db";
import { type InsertSession, session } from "@/db/schema";
import { addMinutes, addMonths } from "date-fns";
import { rrulestr } from "rrule";
import type { z } from "zod";
import type { AddSessionsUseCaseSchema } from "../lib/schemas";

export const addSessionUseCase = async (
  data: z.infer<typeof AddSessionsUseCaseSchema>,
) => {
  const { formData, hubEndsOn, userId, hubStartsOn, hubId } = data;
  const { date, startTime, endTime, rrule: rruleStr } = formData;

  const sessions: InsertSession[] = [];
  const durationInMinutes =
    (endTime.hour - startTime.hour) * 60 + endTime.minute - startTime.minute;

  if (rruleStr) {
    const rrule = rrulestr(rruleStr);
    const dstart = rrule.options.dtstart;
    const rruleStartsOn = new Date(hubStartsOn);
    const rruleEndsOn = hubEndsOn ? new Date(hubEndsOn) : addMonths(dstart, 6);

    const rruleDates = rrule.between(rruleStartsOn, rruleEndsOn, true);

    rruleDates.forEach((rruleDate) => {
      rruleDate.setHours(startTime.hour, startTime.minute);
      const e = addMinutes(rruleDate, durationInMinutes);

      sessions.push({
        hubId,
        userId,
        startTime: rruleDate.toISOString(),
        endTime: e.toISOString(),
      });
    });
  } else {
    const startDate = new Date(
      date.year,
      date.month - 1,
      date.day,
      startTime.hour,
      startTime.minute,
    );

    const endDate = addMinutes(startDate, durationInMinutes);

    sessions.push({
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      hubId,
      userId,
    });
  }

  await db.insert(session).values(sessions);
};
