import { addMonths } from "date-fns";
import { datetime, rrulestr } from "rrule";
import { Temporal } from "temporal-polyfill";
import { z } from "zod";

import { serializedDateValue } from "@/shared/lib/serialize-react-aria/serialize-date-value";
import { serializedTime } from "@/shared/lib/serialize-react-aria/serialize-time";

import type { InsertSession } from "@/db/schema";

const calculateRecurrentSessionsInputSchema = z.object({
  hubStartsOn: z.string(),
  hubEndsOn: z.string().optional().nullable(),
  date: serializedDateValue,
  startTime: serializedTime,
  endTime: serializedTime,
  rruleStr: z.string().optional(),
});

export const calculateRecurrentSessions = (
  data: z.infer<typeof calculateRecurrentSessionsInputSchema>,
) => {
  const parsedData = calculateRecurrentSessionsInputSchema.safeParse(data);

  if (!parsedData.success) {
    return [];
  }

  const { hubEndsOn, hubStartsOn, startTime, endTime, rruleStr, date } =
    parsedData.data;

  const sessions: Omit<InsertSession, "hubId" | "userId">[] = [];
  const durationInMinutes =
    (endTime.hour - startTime.hour) * 60 + endTime.minute - startTime.minute;

  if (rruleStr) {
    const userTimezone = Temporal.Now.timeZoneId();
    const hubStartsOnDate = new Date(hubStartsOn);
    const hubEndsOnDate = hubEndsOn ? new Date(hubEndsOn) : undefined;

    const rrule = rrulestr(rruleStr);
    const dstart = rrule.options.dtstart;

    const rruleStartsOn = datetime(
      hubStartsOnDate.getFullYear(),
      hubStartsOnDate.getMonth() + 1,
      hubStartsOnDate.getDate(),
    );
    const rruleEndsOn = hubEndsOnDate
      ? datetime(
          hubEndsOnDate.getFullYear(),
          hubEndsOnDate.getMonth() + 1,
          hubEndsOnDate.getDate(),
        )
      : addMonths(dstart, 6);

    const rruleDates = rrule.between(rruleStartsOn, rruleEndsOn, true);

    rruleDates.forEach((rruleDate: Date) => {
      // Create PlainDateTime from the rrule date and specified times
      const startDateTime = Temporal.PlainDateTime.from({
        year: rruleDate.getFullYear(),
        month: rruleDate.getMonth() + 1,
        day: rruleDate.getDate(),
        hour: startTime.hour,
        minute: startTime.minute,
      });

      const endDateTime = startDateTime.add({ minutes: durationInMinutes });

      // Convert to ZonedDateTime in user's timezone, then to ISO string
      const startZoned = startDateTime.toZonedDateTime(userTimezone);
      const endZoned = endDateTime.toZonedDateTime(userTimezone);

      sessions.push({
        startTime: startZoned.toInstant().toString(),
        endTime: endZoned.toInstant().toString(),
      });
    });
  } else {
    // Use Temporal to create timestamps in the user's local timezone
    const userTimezone = Temporal.Now.timeZoneId();

    const startDateTime = Temporal.PlainDateTime.from({
      year: date.year,
      month: date.month,
      day: date.day,
      hour: startTime.hour,
      minute: startTime.minute,
    });

    const endDateTime = startDateTime.add({ minutes: durationInMinutes });

    // Convert to ZonedDateTime in user's timezone, then to ISO string
    const startZoned = startDateTime.toZonedDateTime(userTimezone);
    const endZoned = endDateTime.toZonedDateTime(userTimezone);

    sessions.push({
      startTime: startZoned.toInstant().toString(),
      endTime: endZoned.toInstant().toString(),
    });
  }

  return sessions;
};
