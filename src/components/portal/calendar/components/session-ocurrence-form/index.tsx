"use client";

import {
  DatePicker,
  DatePickerContent,
} from "@/components/ui/react-aria/date-picker";
import { FieldError } from "@/components/ui/react-aria/field-error";
import { ListBoxItem } from "@/components/ui/react-aria/list-box";
import {
  SelectField,
  SelectFieldContent,
  SelectTrigger,
} from "@/components/ui/react-aria/select-field";
import { TextField } from "@/components/ui/react-aria/text-field";
import { TimeField } from "@/components/ui/react-aria/time-field";
import { RecurrenceSelect } from "@/components/ui/recurrence-select";
import {
  TimezoneSelectContent,
  TimezoneSelectField,
} from "@/components/ui/timezone-select-field";
import { cn } from "@/lib/utils";
import {
  ArrowRight02Icon,
  CalendarAdd01Icon,
  Folder02Icon,
} from "@hugeicons/react";
import { CalendarDate } from "@internationalized/date";
import { Form, Separator } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import type { SessionOcurrenceFormSchema } from "./schema";

export const SessionOccurrenceFrom = () => {
  const form = useForm<z.infer<typeof SessionOcurrenceFormSchema>>({});

  const onSubmit = (values: z.infer<typeof SessionOcurrenceFormSchema>) => {
    console.log(values);
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)} className="relative h-full">
      <div className="bg-gradient-to-t from-[#30EEAC]/30 to-transparent absolute bottom-0 left-0 h-[300px] w-full" />
      <div className="py-6 z-20 relative">
        <div className="flex items-center gap-3 mb-6 px-4">
          <CalendarAdd01Icon
            size={24}
            variant="duotone"
            color="var(--color-text)"
          />
          <div>
            <p className="text-lg font-medium"> Create / edit session</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex flex-row gap-1 px-2">
            <div className="w-full space-y-1">
              <Controller
                control={form.control}
                name="hubId"
                render={({
                  field: { onChange, value, ...restField },
                  fieldState: { error, invalid },
                }) => (
                  <SelectField
                    {...restField}
                    onSelectionChange={onChange}
                    selectedKey={value}
                    placeholder="Hub"
                    aria-label="Hub"
                    validationBehavior="aria"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                  >
                    <SelectTrigger
                      size={"sm"}
                      variant={"ghost"}
                      className={cn(
                        "w-full font-normal rounded-lg",
                        "data-[pressed]:border-base",
                        "data-[pressed]:bg-base-highlight",
                      )}
                      icon={Folder02Icon}
                    />
                    <SelectFieldContent
                      placement="left top"
                      offset={8}
                      className="w-[250px]"
                      items={[{ id: 1, name: "Math Tutoring Hub" }]}
                    >
                      {({ id, name }) => (
                        <ListBoxItem id={id} showCheckIcon>
                          {name}
                        </ListBoxItem>
                      )}
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
                    placeholder="Title"
                    validationBehavior="aria"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    className={cn(
                      "w-auto ml-7",
                      "bg-transparent border-transparent transition-colors",
                      "hover:bg-base-highlight",
                    )}
                  />
                )}
              />
            </div>
          </div>
          <Separator className="bg-border" />

          <div className="flex flex-col gap-1 px-2">
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
                  className="border-transparent"
                >
                  <DatePickerContent placement="left top" offset={8} />
                </DatePicker>
              )}
            />
            <Controller
              control={form.control}
              name="timeSchedule"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <div>
                    <div className="flex items-center gap-2 w-full">
                      <TimeField
                        onChange={(start) => onChange({ ...value, start })}
                        value={value?.start}
                        className="border-transparent"
                        aria-label="Start time"
                        validationBehavior="aria"
                        size={"sm"}
                        withIcon
                      />
                      <div className="size-7 shrink-0 flex items-center justify-center dark:bg-neutral-700 bg-neutral-300 dark:text-neutral-200 text-neutral-600 rounded-lg">
                        <ArrowRight02Icon size={16} />
                      </div>
                      <TimeField
                        onChange={(end) => onChange({ ...value, end })}
                        value={value?.end}
                        className="border-transparent"
                        aria-label="End time"
                        validationBehavior="aria"
                        size={"sm"}
                      />
                    </div>
                    <FieldError errorMessage={error?.message} />
                  </div>
                );
              }}
            />
            <Controller
              control={form.control}
              name="timezone"
              render={({
                field: { onChange, value, ...restField },
                fieldState: { error, invalid },
              }) => (
                <TimezoneSelectField
                  {...restField}
                  onSelectionChange={onChange}
                  selectedKey={value}
                  aria-label="Session timezone"
                  validationBehavior="aria"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  className="border-transparent"
                >
                  <TimezoneSelectContent
                    placement="left top"
                    offset={8}
                    className="max-h-[300px]! w-[300px]"
                  />
                </TimezoneSelectField>
              )}
            />
            <RecurrenceSelect
              selectedDate={new CalendarDate(2024, 12, 19)}
              onChange={(rrule) => console.log(rrule)}
            />
          </div>
        </div>
      </div>
    </Form>
  );
};
