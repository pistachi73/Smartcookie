import type { InsertSession } from "@/db/schema";
import { serializedDateValue } from "@/shared/lib/serialize-react-aria/serialize-date-value";
import { serializedTime } from "@/shared/lib/serialize-react-aria/serialize-time";
import { addMinutes, addMonths } from "date-fns";
import { datetime, rrulestr } from "rrule";
import { z } from "zod";

const calculateRecurrentSessionsInputSchema = z.object({
  hubStartsOn: z.string(),
  hubEndsOn: z.string().optional(),
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
      rruleDate.setHours(startTime.hour, startTime.minute);
      const e = addMinutes(rruleDate, durationInMinutes);

      sessions.push({
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
    });
  }

  return sessions;
};
