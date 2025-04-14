"use client";

import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { parseDateTime } from "@internationalized/date";
import {
  Controller,
  type UseFormReturn,
  useFormState,
  useWatch,
} from "react-hook-form";
import type { z } from "zod";

import type { SessionStatus } from "@/db/schema/session";
import { ToggleGroup } from "@/shared/components/ui/toggle-group";
import { cn } from "@/shared/lib/classes";
import { DatePicker } from "@/ui/date-picker";
import { Label, fieldStyles } from "@/ui/field";
import { TimeField } from "@/ui/time-field";
import { Toggle } from "@/ui/toggle";

import type { UpdateSessionFormSchema } from "../../lib/sessions.schema";

const sessionStatusOptions: {
  id: SessionStatus;
  label: string;
  className: string;
}[] = [
  {
    id: "completed",
    label: "Completed",
    className:
      "data-selected:bg-green-200 data-selected:text-green-900 data-selected:inset-ring-green-700 dark:data-selected:bg-green-950 dark:data-selected:text-green-100 dark:data-selected:inset-ring-green-700",
  },
  {
    id: "upcoming",
    label: "Upcoming",
    className:
      "data-selected:bg-blue-200 data-selected:text-blue-900 data-selected:inset-ring-blue-700 dark:data-selected:bg-blue-950 dark:data-selected:text-blue-100 dark:data-selected:inset-ring-blue-700",
  },
  {
    id: "cancelled",
    label: "Cancelled",
    className:
      "data-selected:bg-danger/10 data-selected:text-danger data-selected:inset-ring-danger dark:data-selected:bg-danger/40 dark:data-selected:text-danger-fg dark:data-selected:inset-ring-danger",
  },
];

interface UpdateSessionsFormProps {
  form: UseFormReturn<z.infer<typeof UpdateSessionFormSchema>>;
  minDate?: string;
  maxDate?: string | null;
}

export function UpdateSessionsForm({
  form,
  minDate,
  maxDate,
}: UpdateSessionsFormProps) {
  const [startTime] = useWatch({
    control: form.control,
    name: ["startTime"],
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

      <div className="flex flex-col gap-1.5">
        <Label isRequired={true}>Status</Label>

        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <ToggleGroup
              gap={1}
              selectionMode="single"
              className="flex-1 flex-wrap"
              selectedKeys={[field.value]}
              aria-label="Session status"
              onSelectionChange={(value) => {
                const status = Array.from(value)[0];
                field.onChange(status);
              }}
            >
              {sessionStatusOptions.map(({ id, label, className }) => (
                <Toggle
                  appearance="outline"
                  key={id}
                  id={id}
                  className={cn(
                    "data-hovered:bg-overlay-elevated flex-1",
                    className,
                  )}
                >
                  {label}
                </Toggle>
              ))}
            </ToggleGroup>
          )}
        />
      </div>
    </div>
  );
}
