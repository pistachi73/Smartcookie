import { useCalendarStore } from "@/providers/calendar-store-provider";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import type { OccurrenceFormSchema } from "./schema";
import { defaultformData } from "./utils";

type OccurrenceForm = z.infer<typeof OccurrenceFormSchema>;

//TODO: EXPLORE THIS HOOK
export const useEventFormOverrides = () => {
  const { reset } = useFormContext();

  const { editedOccurrenceId } = useCalendarStore(
    useShallow((store) => ({
      editedOccurrenceId: store.editedOccurrenceId,
    })),
  );

  const edittedOccurrence = useCalendarStore(
    useShallow((store) => store.occurrences.get(editedOccurrenceId ?? -2)),
  );

  // Memoize parsed occurrence data to prevent unnecessary resets

  //Handle URL parameter overrides
  // useUpdateEffect(() => {
  //   console.time("url");
  //   if (!paramsOverrides) return;
  //   console.timeEnd("url");

  //   console.log("update URL parameters");
  //   const update: Partial<z.infer<typeof OccurrenceFormSchema>> = {};

  //   if (paramsOverrides.date) update.date = paramsOverrides.date;
  //   if (paramsOverrides.startTime) update.startTime = paramsOverrides.startTime;
  //   if (paramsOverrides.endTime) update.endTime = paramsOverrides.endTime;
  //   if (paramsOverrides.timezone) update.timezone = paramsOverrides.timezone;

  //   if (Object.keys(update).length > 0) {
  //     setValue("date", update.date ?? getValues("date"));
  //     // Use silent update to prevent validation triggers
  //     Object.entries(update).forEach(([key, value]) => {
  //       setValue(key as keyof OccurrenceForm, value, {
  //         shouldValidate: false,
  //         shouldDirty: false,
  //       });
  //     });
  //   }
  // }, [paramsOverrides]);

  // Handle occurrence edits
  useEffect(() => {
    if (!edittedOccurrence) return;

    const { startTime, endTime, ...rest } = edittedOccurrence;
    if (!startTime || !endTime) return;

    reset({
      ...defaultformData, // Ensure default values are properly typed
      // date: new CalendarDate(startTime.year, startTime.month, startTime.day),
      // startTime: new Time(startTime.hour, startTime.minute),
      // endTime: new Time(endTime.hour, endTime.minute),
    });
  }, [edittedOccurrence]);
};
