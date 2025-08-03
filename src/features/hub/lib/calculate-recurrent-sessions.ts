import { getLocalTimeZone } from "@internationalized/date";
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
    const userTimezone = getLocalTimeZone();
    const hubStartsOnDate = new Date(hubStartsOn);
    const hubEndsOnDate = hubEndsOn ? new Date(hubEndsOn) : undefined;

    const rrule = rrulestr(rruleStr);
    const dstart = rrule.options.dtstart;

    const rruleStartsOn = datetime(
      hubStartsOnDate.getFullYear(),
      hubStartsOnDate.getMonth() + 1,
      hubStartsOnDate.getDate(),
    );

    let rruleDates: Date[];

    // Check if the rrule has a count (COUNT parameter)
    if (rrule.options.count) {
      // For count-based rules, use rrule.all() to get all occurrences
      // then filter to only include dates from our calculated start date onwards
      const allDates = rrule.all();
      rruleDates = allDates.filter((date) => date >= rruleStartsOn);
    } else {
      // For date-based rules, use between with start and end dates
      // Calculate the maximum allowed end date (hub end date or 2 months from start)
      const maxEndDate = hubEndsOnDate
        ? datetime(
            hubEndsOnDate.getFullYear(),
            hubEndsOnDate.getMonth() + 1,
            hubEndsOnDate.getDate(),
          )
        : addMonths(dstart, 2);

      // Use the earlier of the rrule's UNTIL date or our maximum end date
      const rruleEndsOn = rrule.options.until
        ? rrule.options.until < maxEndDate
          ? rrule.options.until
          : maxEndDate
        : maxEndDate;

      // Create a new rrule starting from our calculated start date
      const adjustedRrule = rrule.clone();
      adjustedRrule.options.dtstart = rruleStartsOn;

      rruleDates = adjustedRrule.between(rruleStartsOn, rruleEndsOn, true);
    }

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
