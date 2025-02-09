import { useCalendarStore } from "@/providers/calendar-store-provider";
import { removeNullValues } from "@/utils/remove-null-values";
import { CalendarDate, Time } from "@internationalized/date";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { consumeOccurrenceOverrides } from "../utils";
import type { OccurrenceFormSchema } from "./schema";
import { defaultformData } from "./utils";

export const useEventFormOverrides = (
  form: UseFormReturn<z.infer<typeof OccurrenceFormSchema>>,
) => {
  const searchParams = useSearchParams();
  const { eventOccurrences, editingEventOccurrenceId } = useCalendarStore(
    useShallow((store) => ({
      eventOccurrences: store.eventOccurrences,
      editingEventOccurrenceId: store.editingEventOccurrenceId,
    })),
  );

  //Overrides from draft events in search params
  useEffect(() => {
    const overrides = consumeOccurrenceOverrides(searchParams);
    if (!overrides) return;
    const { date, startTime, endTime, timezone } = overrides;
    if (date) {
      form.setValue("date", date);
    }
    if (startTime) {
      form.setValue("startTime", startTime);
    }
    if (endTime) {
      form.setValue("endTime", endTime);
    }
    if (timezone) {
      form.setValue("timezone", timezone);
    }
  }, [searchParams, form.setValue]);

  useEffect(() => {
    if (!editingEventOccurrenceId) return;
    const eventOccurrence = eventOccurrences?.[editingEventOccurrenceId];

    if (!eventOccurrence) return;

    // Remove null values from event occurrence
    const clean = removeNullValues(eventOccurrence);
    const { userId, startTime, endTime, ...rest } = clean;

    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);

    form.reset({
      ...defaultformData,
      date: new CalendarDate(
        startTimeDate.getFullYear(),
        startTimeDate.getMonth() + 1,
        startTimeDate.getDate(),
      ),
      startTime: new Time(startTimeDate.getHours(), startTimeDate.getMinutes()),
      endTime: new Time(endTimeDate.getHours(), endTimeDate.getMinutes()),
      ...rest,
    });
  }, [editingEventOccurrenceId, eventOccurrences, form.reset]);
};
