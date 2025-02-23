import type {
  Event,
  InsertEvent,
  InsertOccurrence,
  Occurrence,
} from "@/db/schema";
import type { SerializedDateValue } from "@/lib/serialize-react-aria/serialize-date-value";
import type { SerializedTime } from "@/lib/serialize-react-aria/serialize-time";
import { getLocalTimeZone } from "@internationalized/date";
import { addDays, setHours, setMinutes } from "date-fns";
import { RRule } from "rrule";
import type { z } from "zod";
import { DEFAULT_EVENT_COLOR } from "../utils";
import type {
  OccurrenceFormSchema,
  SerializedOccurrenceFormSchema,
} from "./schema";

export const prepareEventAndOccurrencesForDatabase = (
  formData: z.infer<typeof SerializedOccurrenceFormSchema>,
) => {
  const {
    date,
    startTime: formStartTime,
    endTime: formEndTime,
    recurrenceRule,
    participants,
    ...rest
  } = formData;

  const startTime = new Date(
    date.year,
    date.month - 1,
    date.day,
    formStartTime.hour,
    formStartTime.minute,
  );

  const endTime = new Date(
    date.year,
    date.month - 1,
    date.day,
    formEndTime.hour,
    formEndTime.minute,
  );

  const event: Omit<InsertEvent, "userId"> = {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    isRecurring: Boolean(recurrenceRule),
    recurrenceRule,
    ...rest,
  };

  const occurrences: Omit<InsertOccurrence, "eventId">[] = recurrenceRule
    ? generateRecurrentOccurrences({
        formRecurrenceRuleString: recurrenceRule,
        formStartTime,
        formEndTime,
      })
    : [
        {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      ];

  return { event, occurrences };
};

export const generateRecurrentOccurrences = ({
  formRecurrenceRuleString,
  formStartTime,
  formEndTime,
}: {
  formRecurrenceRuleString: string;
  formStartTime: SerializedTime;
  formEndTime: SerializedTime;
}) => {
  const occurrences: Omit<InsertOccurrence, "eventId">[] = [];
  const rrule = RRule.fromString(formRecurrenceRuleString);
  const { until, count, dtstart } = rrule.options;

  const currentYear = new Date().getFullYear();
  const lastDayOfYear = addDays(new Date(currentYear + 1, 0, 1), -1);

  const rruleDates: Date[] =
    until || count ? rrule.all() : rrule.between(dtstart, lastDayOfYear, true);

  for (const occurrence of rruleDates) {
    const occurrenceDate = new Date(
      Date.UTC(
        occurrence.getFullYear(),
        occurrence.getMonth(),
        occurrence.getDate(),
      ),
    );
    const startTime = setHours(
      setMinutes(occurrenceDate, formStartTime.minute),
      formStartTime.hour,
    );
    const endTime = setHours(
      setMinutes(occurrenceDate, formEndTime.minute),
      formEndTime.hour,
    );

    occurrences.push({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });
  }

  return occurrences;
};

export const createDateFromParts = (
  calendarDate: SerializedDateValue,
  time: SerializedTime,
) =>
  new Date(
    calendarDate.year,
    calendarDate.month - 1,
    calendarDate.day,
    time.hour,
    time.minute,
  ).toISOString();

// export const buildToUpdateEventData = (
//   formData: Partial<z.infer<typeof SerializedOccurrenceFormSchema>>,
// ) => {
//   const { startTime, endTime, date, participants, ...restFormData } = formData;
//   const toUpdateData: Partial<InsertEvent> = {}

//   if(startTime ) {
//     toUpdateData.startTime =
//     }
//   return {
//     ...restFormData,
//   };
// };

export const mapDBOccurrenceToCalendarEvent = ({
  event,
  occurrence,
}: {
  event: Event;
  occurrence?: Occurrence;
}) => {
  return {
    ...event,
    eventId: event.id,
    hubId: event.hubId || null,
    description: event.description || null,
    recurrenceRule: event.recurrenceRule || null,
    price: event.price || null,
    isRecurring: event.isRecurring || false,
    timezone: event.timezone || getLocalTimeZone(),
    eventOccurrenceId: occurrence?.id,
    startTime: occurrence?.startTime
      ? new Date(`${occurrence.startTime}Z`)
      : new Date(`${event.startTime}Z`),
    endTime: occurrence?.endTime
      ? new Date(`${occurrence.endTime}Z`)
      : new Date(`${event.endTime}Z`),
    isDraft: false,
  };
};
// export const mapDBOccurrencesToCalendarEvents = ({
//   event,
//   occurrences,
// }: {
//   event: Event;
//   occurrences?: Occurrence[];
//   occurrencesIds?: number[];
// }): CalendarEventOccurrence[] => {
//   if (!occurrences) return [];

//   return occurrences.map((occurrence) => ({
//     ...event,
//     eventId: event.id,
//     hubId: event.hubId || null,
//     description: event.description || null,
//     recurrenceRule: event.recurrenceRule || null,
//     price: event.price || null,
//     isRecurring: event.isRecurring || false,
//     timezone: event.timezone || getLocalTimeZone(),
//     eventOccurrenceId: occurrence.id,
//     startTime: new Date(`${occurrence.startTime}Z`),
//     endTime: new Date(`${occurrence.endTime}Z`),
//     isDraft: false,
//   }));
// };

export const defaultformData: Partial<z.infer<typeof OccurrenceFormSchema>> = {
  hubId: undefined,
  title: "",
  description: "",
  date: undefined,
  startTime: undefined,
  endTime: undefined,
  timezone: getLocalTimeZone(),
  recurrenceRule: undefined,
  participants: [],
  isBillable: false,
  price: undefined,
  color: DEFAULT_EVENT_COLOR,
};
