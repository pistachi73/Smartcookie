"use client";

import { Button } from "@/components/ui/button";

import { DatePicker } from "@/components/ui/react-aria/date-picker";
import { ListBoxItem } from "@/components/ui/react-aria/list-box";
import {
  SelectField,
  SelectFieldContent,
} from "@/components/ui/react-aria/select-field";
import { TextField } from "@/components/ui/react-aria/text-field";
import { TimeField } from "@/components/ui/react-aria/time-field";
import {
  RecurrenceRuleSchema,
  RecurrenceSelect,
} from "@/components/ui/recurrence-select";
import { Separator } from "@/components/ui/separator";
import { getCurrentTimezone } from "@/components/ui/timezone-select/utils";
import type { SessionOccurrence } from "@/lib/generate-session-ocurrences";
import { cn } from "@/lib/utils";
import { timezones } from "@/utils/timezones";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight02Icon,
  CalendarAdd01Icon,
  EarthIcon,
  Folder01Icon,
} from "@hugeicons/react";
import { Time } from "@internationalized/date";
import type { DateValue, TimeValue } from "react-aria";
import { Form, SelectValue } from "react-aria-components";
import { Controller, type UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { useCalendarContext } from "../../calendar-context";

type SessionUpdateFormProps = {
  sessionOcurrence?: SessionOccurrence;
};

const SessionUpdateSchema = z
  .object({
    hubId: z.number(),
    title: z.string(),
    date: z.custom<DateValue>(),
    startHour: z.custom<TimeValue>(),
    endHour: z.custom<TimeValue>(),
    timezone: z.string(),
    recurrenceRule: RecurrenceRuleSchema,
  })
  .refine(
    ({ startHour, endHour }) =>
      startHour?.hour < endHour.hour ||
      (startHour?.hour === endHour?.hour &&
        startHour?.minute < endHour?.minute),
    {
      path: ["wrongHour"],
      message: "End time must be greater than start time",
    },
  );

export type SesionUpdateForm = UseFormReturn<
  z.infer<typeof SessionUpdateSchema>
>;

export const SessionUpdateForm = ({
  sessionOcurrence,
}: SessionUpdateFormProps) => {
  console.log(getCurrentTimezone());
  const { hubs } = useCalendarContext();
  const form = useForm<z.infer<typeof SessionUpdateSchema>>({
    resolver: zodResolver(SessionUpdateSchema),
    defaultValues: {
      hubId: sessionOcurrence?.hubId,
      title: sessionOcurrence?.title ?? "",
      date: sessionOcurrence?.startTime,
      startHour: sessionOcurrence?.startTime
        ? new Time(
            sessionOcurrence?.startTime.getHours(),
            sessionOcurrence?.startTime.getMinutes(),
          )
        : undefined,
      endHour: sessionOcurrence?.endTime
        ? new Time(
            sessionOcurrence?.endTime.getHours(),
            sessionOcurrence?.endTime.getMinutes(),
          )
        : undefined,
      timezone: getCurrentTimezone()?.name ?? "",
      recurrenceRule: sessionOcurrence?.recurrenceRule ?? {
        frequency: "no-recurrence",
        interval: 1,
      },
    },

    mode: "onChange",
  });

  console.log(hubs);
  // console.log(form.getFieldState("wrongHour"));

  const onSubmit = (values: z.infer<typeof SessionUpdateSchema>) => {};

  return (
    <Form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 max-w-[400px]"
    >
      <div className="flex items-center gap-3">
        <CalendarAdd01Icon
          size={36}
          color="var(--color-responsive-dark)"
          variant="duotone"
        />
        <div>
          <p className="text-lg font-medium"> Create / edit session</p>
          <p className="text-sm text-neutral-500">
            Fill in the data below to edit the session
          </p>
        </div>
      </div>
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-medium">Hub and title</p>

          <Controller
            control={form.control}
            name="hubId"
            render={({
              field: { onChange, ...restField },
              fieldState: { error, invalid },
            }) => (
              <SelectField
                {...restField}
                onSelectionChange={onChange}
                placeholder="Select hub"
                aria-label="Hub"
                validationBehavior="aria"
                isInvalid={invalid}
                errorMessage={error?.message}
              >
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className="w-full justify-between font-normal rounded-lg"
                >
                  <SelectValue className="data-[placeholder]:text-neutral-500" />
                  <Folder01Icon size={16} />
                </Button>
                <SelectFieldContent
                  className="min-w-[var(--trigger-width)]"
                  items={hubs}
                >
                  {({ id, name }) => <ListBoxItem id={id}>{name}</ListBoxItem>}
                </SelectFieldContent>
              </SelectField>
            )}
          />
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState: { error, invalid } }) => (
              <TextField
                {...field}
                size={"sm"}
                aria-label="Session title"
                placeholder="Session title"
                validationBehavior="aria"
                isInvalid={invalid}
                errorMessage={error?.message}
              />
            )}
          />
        </div>
        <Separator />
        <div className="space-y-2">
          <p className="text-sm font-medium">Date and time</p>
          <Controller
            control={form.control}
            name="date"
            render={({ field, fieldState: { invalid, error } }) => (
              <DatePicker
                {...field}
                size={"sm"}
                aria-label="Session date"
                validationBehavior="aria"
                isInvalid={invalid}
                errorMessage={error?.message}
              />
            )}
          />
          <div className="flex items-center gap-2 w-full">
            <Controller
              control={form.control}
              name="startHour"
              render={({ field, fieldState: { error, invalid } }) => (
                <TimeField
                  {...field}
                  className="w-full"
                  validationBehavior="aria"
                  size={"sm"}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
            <div className="size-7 shrink-0 flex items-center justify-center dark:bg-neutral-700 bg-neutral-300 dark:text-neutral-200 text-neutral-600 rounded-lg">
              <ArrowRight02Icon size={16} />
            </div>
            <Controller
              control={form.control}
              name="endHour"
              render={({ field, fieldState: { error, invalid } }) => (
                <TimeField
                  {...field}
                  validationBehavior="aria"
                  className="w-full"
                  size={"sm"}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
          </div>

          {/* <TimezoneSelect form={form} /> */}
          <Controller
            control={form.control}
            name="timezone"
            render={({
              field: { onChange, value, ...restField },
              fieldState: { error, invalid },
            }) => (
              <SelectField
                {...restField}
                onSelectionChange={onChange}
                selectedKey={value}
                aria-label="Session timezone"
                validationBehavior="aria"
                isInvalid={invalid}
                errorMessage={error?.message}
              >
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className={cn(
                    "w-full justify-between font-normal rounded-lg",
                    !value && "text-neutral-500",
                  )}
                >
                  <SelectValue className="data-[placeholder]:text-neutral-500" />
                  <EarthIcon size={16} className="" />
                </Button>
                <SelectFieldContent
                  className="min-w-[var(--trigger-width)] max-h-[300px]!"
                  items={timezones}
                  placement="bottom"
                >
                  {({ descriptiveName, name }) => (
                    <ListBoxItem id={name}>{descriptiveName}</ListBoxItem>
                  )}
                </SelectFieldContent>
              </SelectField>
            )}
          />
        </div>
        <Separator />
        <div className="space-y-2">
          <p className="text-sm font-medium">Recurrence</p>
          <RecurrenceSelect form={form} />
        </div>
      </div>
    </Form>
  );
};
