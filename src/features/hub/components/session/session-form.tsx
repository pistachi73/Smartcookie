"use client";

import { DatePicker } from "@/shared/components/ui/date-picker";
import { Label, fieldStyles } from "@/shared/components/ui/field";
import { RecurrenceSelect } from "@/shared/components/ui/recurrence-select";
import { TimeField } from "@/shared/components/ui/time-field";
import { cn } from "@/shared/lib/classes";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { type CalendarDate, parseDateTime } from "@internationalized/date";
import {
  Controller,
  type UseFormReturn,
  useFormState,
  useWatch,
} from "react-hook-form";
import type { z } from "zod";
import type { SessionFormSchema } from "../../lib/schemas";

interface SessionFormProps {
  form: UseFormReturn<z.infer<typeof SessionFormSchema>>;
  minDate?: string;
  maxDate?: string | null;
}

export function SessionForm({ form, minDate, maxDate }: SessionFormProps) {
  const [date, startTime] = useWatch({
    control: form.control,
    name: ["date", "startTime"],
  });

  const formState = useFormState({
    control: form.control,
  });

  const endStartTimeError =
    formState.errors.startTime?.message || formState.errors.endTime?.message;

  const maxCalendarDate = maxDate ? parseDateTime(maxDate) : undefined;
  const minCalendarDate = minDate ? parseDateTime(minDate) : undefined;

  return (
    <div className="space-y-4">
      <Controller
        control={form.control}
        name="date"
        render={({ field, fieldState: { invalid, error } }) => (
          <DatePicker
            {...field}
            aria-label="Session date"
            label="Date"
            isRequired={true}
            validationBehavior="aria"
            isInvalid={invalid}
            errorMessage={error?.message}
            overlayProps={{
              placement: "bottom",
              offset: 8,
            }}
            minValue={minCalendarDate}
            maxValue={maxCalendarDate}
          />
        )}
      />
      <div className="flex flex-col gap-1.5">
        <Label isRequired={true}>Start & End Time</Label>

        <div className="flex items-center gap-2 w-full">
          <Controller
            control={form.control}
            name="startTime"
            render={({
              field: { onChange, value, ...restField },
              fieldState: { invalid },
            }) => (
              <TimeField
                {...restField}
                value={value}
                onChange={onChange}
                hourCycle={24}
                isInvalid={invalid}
                className="flex-1"
                aria-label="Start time"
              />
            )}
          />
          <div className="size-10 shrink-0 flex items-center justify-center bg-overlay-highlight text-muted-fg rounded-lg">
            <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
          </div>
          <Controller
            control={form.control}
            name="endTime"
            render={({
              field: { onChange, value, ...restField },
              fieldState: { invalid },
            }) => (
              <TimeField
                {...restField}
                value={value}
                onChange={onChange}
                hourCycle={24}
                isInvalid={invalid}
                minValue={startTime}
                className="flex-1"
                aria-label="End time"
              />
            )}
          />
        </div>
        <p className={cn(fieldStyles().fieldError())}>{endStartTimeError}</p>
      </div>
      <Controller
        control={form.control}
        name="rrule"
        render={({ field: { onChange, value } }) => (
          <RecurrenceSelect
            value={value}
            onChange={onChange}
            selectedDate={date}
            label="Recurrence"
            onStartDateChange={(date) =>
              form.setValue("date", date as CalendarDate)
            }
            minDate={minCalendarDate as unknown as CalendarDate}
            maxDate={maxCalendarDate as unknown as CalendarDate}
          />
        )}
      />
    </div>
  );
}
