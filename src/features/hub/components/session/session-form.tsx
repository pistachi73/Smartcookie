"use client";

import { DatePicker } from "@/shared/components/ui/date-picker";
import { Label } from "@/shared/components/ui/field";
import { RecurrenceSelect } from "@/shared/components/ui/recurrence-select";
import { TimeCombobox } from "@/shared/components/ui/time-combobox";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller, type UseFormReturn, useWatch } from "react-hook-form";
import type { z } from "zod";
import type { SessionFormSchema } from "../../lib/schemas";

interface SessionFormProps {
  form: UseFormReturn<z.infer<typeof SessionFormSchema>>;
}

export function SessionForm({ form }: SessionFormProps) {
  const [date, startTime] = useWatch({
    control: form.control,
    name: ["date", "startTime"],
  });

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
            className={{
              fieldGroup: "hover:bg-overlay-highlight",
            }}
            overlayProps={{
              placement: "bottom",
              offset: 8,
            }}
          />
        )}
      />
      <div className="flex flex-col gap-1.5">
        <Label isRequired={true}>Start & End Time</Label>

        <div className="flex items-center gap-2 w-full">
          <Controller
            control={form.control}
            name="startTime"
            render={({ field: { onChange, value, ...restField } }) => (
              <TimeCombobox
                {...restField}
                value={value}
                onChange={onChange}
                withIcon
                className={{
                  input: "text-sm",
                  fieldGroup: "hover:bg-overlay-highlight",
                }}
                listProps={{
                  placement: "bottom",
                  offset: 8,
                }}
              />
            )}
          />
          <div className="size-10 shrink-0 flex items-center justify-center bg-overlay-elevated text-muted-fg rounded-lg">
            <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
          </div>
          <Controller
            control={form.control}
            name="endTime"
            render={({ field: { onChange, value, ...restField } }) => (
              <TimeCombobox
                {...restField}
                value={value}
                onChange={onChange}
                minValue={startTime}
                className={{
                  input: "text-sm",
                  fieldGroup: "hover:bg-overlay-highlight",
                }}
                listProps={{
                  placement: "bottom",
                  offset: 8,
                }}
              />
            )}
          />
        </div>
      </div>
      <Controller
        control={form.control}
        name="rrule"
        render={({ field: { onChange, value } }) => (
          <RecurrenceSelect
            value={value}
            onChange={onChange}
            selectedDate={date}
            contentProps={{
              label: "Recurrence",
            }}
          />
        )}
      />
    </div>
  );
}
