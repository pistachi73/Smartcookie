"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import {
  type CalendarDate,
  parseDateTime,
  type Time,
} from "@internationalized/date";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { z } from "zod";

import { ComboBox } from "@/shared/components/ui/combo-box";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { fieldStyles, Label } from "@/shared/components/ui/field";
import { RecurrenceSelect } from "@/shared/components/ui/recurrence-select";
import { TimeFieldWithSelect } from "@/shared/components/ui/time-field-with-select";
import { cn } from "@/shared/lib/classes";
import { colorStyleMap } from "@/shared/lib/custom-colors";

import { getHubsByUserIdQueryOptions } from "../../lib/hub-query-options";

interface ColorDotProps {
  color: string;
  className?: string;
}

function ColorDot({ color, className, ...props }: ColorDotProps) {
  return (
    <div
      className={cn(
        "size-2 rounded-full",
        colorStyleMap[color as keyof typeof colorStyleMap]?.dot ||
          colorStyleMap.neutral.dot,
        className,
      )}
      {...props}
    />
  );
}

export const AddSessionFormSchema = z
  .object({
    hubId: z.number(),
    date: z.custom<CalendarDate>(),
    startTime: z.custom<Time>(),
    endTime: z.custom<Time>(),
    rrule: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.endTime && data.startTime && data.endTime <= data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after start time",
      });
    }

    if (!data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Start time is required",
      });
    }

    if (!data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time is required",
      });
    }
  });

interface AddSessionsFormProps {
  minDate?: string;
  maxDate?: string | null;
  disableHubSelection?: boolean;
  removeHubSelection?: boolean;
}

export function AddSessionsForm({
  minDate,
  maxDate,
  disableHubSelection,
  removeHubSelection = false,
}: AddSessionsFormProps) {
  const queryClient = useQueryClient();
  const { data: hubs, isLoading } = useQuery(
    getHubsByUserIdQueryOptions(queryClient),
  );

  const form = useFormContext<z.infer<typeof AddSessionFormSchema>>();
  const [date, startTime, selectedHubId] = useWatch({
    control: form.control,
    name: ["date", "startTime", "hubId"],
  });

  const formState = useFormState({
    control: form.control,
  });

  const endStartTimeError =
    formState.errors.startTime?.message || formState.errors.endTime?.message;

  const maxCalendarDate = maxDate ? parseDateTime(maxDate) : null;
  const minCalendarDate = minDate ? parseDateTime(minDate) : null;

  const hubOptions =
    hubs?.map((hub) => ({
      value: hub.id,
      label: hub.name,
      color: hub.color,
    })) ?? [];

  return (
    <div className="space-y-3">
      {!removeHubSelection && (
        <Controller
          control={form.control}
          name="hubId"
          render={({ field, fieldState: { invalid, error } }) => (
            <ComboBox
              {...field}
              selectedKey={field.value}
              onSelectionChange={(key) => field.onChange(key as number)}
              aria-label="Select hub"
              menuTrigger="focus"
              label="Hub"
              isRequired={true}
              validationBehavior="aria"
              isInvalid={invalid}
              errorMessage={error?.message}
              isDisabled={disableHubSelection}
              isReadOnly={disableHubSelection || isLoading}
            >
              <ComboBox.Input
                placeholder={isLoading ? "Loading hubs..." : "Select a hub"}
              />
              <ComboBox.List items={hubOptions}>
                {(item) => (
                  <ComboBox.Option
                    key={item.value}
                    id={item.value}
                    textValue={item.label}
                  >
                    <ColorDot color={item.color} data-slot="icon" />
                    <ComboBox.Label>{item.label}</ComboBox.Label>
                  </ComboBox.Option>
                )}
              </ComboBox.List>
            </ComboBox>
          )}
        />
      )}

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
            placement="bottom"
            minValue={minCalendarDate}
            maxValue={maxCalendarDate}
            value={field.value}
          />
        )}
      />
      <div className="flex flex-col gap-y-1">
        <Label isRequired={true} className="font-medium">
          Start & End Time
        </Label>

        <div className="flex items-center gap-2 w-full">
          <Controller
            control={form.control}
            name="startTime"
            render={({
              field: { onChange, value, ...restField },
              fieldState: { invalid },
            }) => (
              <TimeFieldWithSelect
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
              <TimeFieldWithSelect
                {...restField}
                value={value}
                onChange={onChange}
                hourCycle={24}
                isInvalid={invalid}
                className="flex-1"
                aria-label="End time"
                {...(startTime && { minValue: startTime })}
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
            minDate={minCalendarDate}
            maxDate={maxCalendarDate}
          />
        )}
      />
    </div>
  );
}
