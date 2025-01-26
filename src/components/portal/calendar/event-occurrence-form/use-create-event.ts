import type { InsertEvent, InsertEventOccurrence } from "@/db/schema";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import type { CalendarEventOccurrence } from "@/stores/calendar-store";
import { getLocalTimeZone } from "@internationalized/date";
import { useMutation } from "@tanstack/react-query";
import { addDays, setHours, setMinutes } from "date-fns";
import { RRule } from "rrule";
import { toast } from "sonner";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { createEventAction } from "../actions";
import type { SessionOcurrenceFormSchema } from "./schema";

//TODO: This might lead into bugs, need to find a better way to handle this
const PLACEHOLDER_EVENT_ID = 9999999999;

export const useCreateEvent = () => {
  const {
    addEventOccurrences,
    removeEventOccurreces,
    clearEditingEventOccurrence,
    clearDraftEventOccurrence,
    setActiveSidebar,
  } = useCalendarStore(
    useShallow(
      ({
        setActiveSidebar,
        addEventOccurrences,
        removeEventOccurreces,
        clearEditingEventOccurrence,
        clearDraftEventOccurrence,
      }) => ({
        setActiveSidebar,
        addEventOccurrences,
        removeEventOccurreces,
        clearEditingEventOccurrence,
        clearDraftEventOccurrence,
      }),
    ),
  );

  const onSuccess = () => {
    clearEditingEventOccurrence();
    clearDraftEventOccurrence();
    setActiveSidebar("main");
  };

  const { mutate: createEvent, isPending: isCreatingEvent } = useMutation({
    mutationFn: async (values: z.infer<typeof SessionOcurrenceFormSchema>) => {
      const {
        date,
        startTime: formStartTime,
        endTime: formEndTime,
        recurrenceRule,
        participants,
        ...rest
      } = values;

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

      const eventOccurrences: Omit<InsertEventOccurrence, "eventId">[] = [];
      if (recurrenceRule) {
        const rrule = RRule.fromString(recurrenceRule);
        const { until, count, dtstart } = rrule.options;

        const lastDayOfYear = addDays(new Date(date.year + 1, 0, 1), -1);

        const rruleDates: Date[] =
          until || count
            ? rrule.all()
            : rrule.between(dtstart, lastDayOfYear, true);

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

          eventOccurrences.push({
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          });
        }
      } else {
        eventOccurrences.push({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        });
      }

      const result = await createEventAction({
        event,
        occurrences: eventOccurrences,
      });

      if (!result?.data) {
        return;
      }

      const { createdEvent, createdOccurrences } = result.data;

      const calendarEventOccurrences: CalendarEventOccurrence[] =
        createdOccurrences.map((occurrence) => ({
          ...createdEvent,
          eventId: createdEvent.id,
          hubId: createdEvent.hubId || null,
          description: createdEvent.description || null,
          recurrenceRule: createdEvent.recurrenceRule || null,
          price: createdEvent.price || null,
          isRecurring: createdEvent.isRecurring || false,
          timezone: createdEvent.timezone || getLocalTimeZone(),
          eventOccurrenceId: occurrence.id,
          startTime: new Date(`${occurrence.startTime}Z`),
          endTime: new Date(`${occurrence.endTime}Z`),
          isDraft: false,
        }));

      addEventOccurrences(calendarEventOccurrences);
      onSuccess();

      toast.success("Event created successfully!");
    },
    onMutate: async (values) => {
      console.log({ values });
    },
  });

  return { createEvent, isCreatingEvent };
};
