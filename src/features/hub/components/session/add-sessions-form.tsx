"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import {
  type CalendarDate,
  parseDateTime,
  type Time,
} from "@internationalized/date";
import { useQuery } from "@tanstack/react-query";
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
import { TimeField } from "@/shared/components/ui/time-field";
import { cn } from "@/shared/lib/classes";
import { colorStyleMap } from "@/shared/lib/custom-colors";

import { getHubsByUserIdQueryOptions } from "../../lib/hub-query-options";

interface ColorDotProps {
  color: string;
  className?: string;
}

function ColorDot({ color, className }: ColorDotProps) {
  return (
    <div
      className={cn(
        "size-2 rounded-full",
        colorStyleMap[color as keyof typeof colorStyleMap]?.dot ||
          colorStyleMap.neutral.dot,
        className,
      )}
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
}

export function AddSessionsForm({
  minDate,
  maxDate,
  disableHubSelection,
}: AddSessionsFormProps) {
  const { data: hubs, isLoading } = useQuery(getHubsByUserIdQueryOptions);

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

  const maxCalendarDate = maxDate ? parseDateTime(maxDate) : undefined;
  const minCalendarDate = minDate ? parseDateTime(minDate) : undefined;

  const hubOptions =
    hubs?.map((hub) => ({
      value: hub.id,
      label: hub.name,
      color: hub.color,
    })) ?? [];

  const selectedHub = hubOptions.find((hub) => hub.value === selectedHubId);

  return (
    <div className="space-y-4">
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
            isDisabled={disableHubSelection || isLoading}
          >
            <ComboBox.Input
              placeholder={isLoading ? "Loading hubs..." : "Select a hub"}
              prefix={
                selectedHub ? <ColorDot color={selectedHub.color} /> : null
              }
            />
            <ComboBox.List
              items={hubOptions}
              shouldFlip={false}
              className={{ popoverContent: "w-[var(--trigger-width)]" }}
            >
              {(item) => (
                <ComboBox.Option
                  key={item.value}
                  id={item.value}
                  textValue={item.label}
                  showSelectedIcon={false}
                >
                  <div className="flex items-center gap-2">
                    <ColorDot color={item.color} />
                    {item.label}
                  </div>
                </ComboBox.Option>
              )}
            </ComboBox.List>
          </ComboBox>
        )}
      />
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
