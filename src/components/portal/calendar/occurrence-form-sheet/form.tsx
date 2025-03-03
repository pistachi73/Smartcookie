"use client";

import { ParticipantsCombobox } from "@/components/ui/participants-combobox";
import { RecurrenceSelect } from "@/components/ui/recurrence-select";

import {
  DatePicker,
  NumberField,
  Select,
  Switch,
  TextField,
  Textarea,
} from "@/components/ui";
import { TimeCombobox } from "@/components/ui/time-combobox";
import { TimezoneCombobox } from "@/components/ui/timezone-combobox";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { ArrowRight02Icon, Folder02Icon } from "@hugeicons/react";
import { CalendarDate, toCalendarDate } from "@internationalized/date";
import { useRef } from "react";
import { Controller, type UseFormReturn, useWatch } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { EventColorPicker } from "../components/event-color-picker";
import type { OccurrenceFormSchema } from "./schema";
import { useEventFormOverrides } from "./use-event-form-overrides";

const useEventOccurrenceForm = () =>
  useCalendarStore(
    useShallow((store) => ({
      hubs: store.hubs,
      selectedDate: store.selectedDate,
      updateOccurrences: store.updateOccurrences,
      editedOccurrenceId: store.editedOccurrenceId,
    })),
  );

export const EventOccurrenceForm = ({
  form,
  isDisabled,
}: {
  form: UseFormReturn<z.infer<typeof OccurrenceFormSchema>>;
  isDisabled: boolean;
}) => {
  const { hubs, updateOccurrences, selectedDate, editedOccurrenceId } =
    useEventOccurrenceForm();
  const timeComboboxTriggerRef = useRef<HTMLDivElement>(null);
  const timezoneComboboxTriggerRef = useRef<HTMLDivElement>(null);
  const colorSwatchTriggerRef = useRef<HTMLDivElement>(null);

  const [startTime, date, isBillable] = useWatch({
    control: form.control,
    name: ["startTime", "date", "isBillable"],
  });

  useEventFormOverrides();

  // useEffect(() => {
  //   const subscription = form.watch((value, { name, type }) => {
  //     if (type !== "change" || editedOccurrenceId !== -1) return;

  //     switch (name) {
  //       case "title": {
  //         console.log("va", value.title);
  //         updateOccurrences({
  //           id: -1,
  //           overrides: {
  //             title: value.title!,
  //           },
  //         });
  //         break;
  //       }
  //       // case "startTime": {
  //       //   const { date, startTime } = value;
  //       //   if (!date?.year || !date.month || !startTime) return;

  //       //   setDraftEventOccurrence({
  //       //     startTime: new Date(
  //       //       date?.year,
  //       //       date.month - 1,
  //       //       date.day,
  //       //       startTime.hour,
  //       //       startTime.minute,
  //       //     ),
  //       //   });
  //       //   break;
  //       // }
  //       // case "endTime": {
  //       //   const { date, endTime } = value;
  //       //   if (!date?.year || !date.month || !endTime) return;

  //       //   setDraftEventOccurrence({
  //       //     endTime: new Date(
  //       //       date?.year,
  //       //       date.month - 1,
  //       //       date.day,
  //       //       endTime.hour,
  //       //       endTime.minute,
  //       //     ),
  //       //   });
  //       //   break;
  //       // }
  //       // case "date": {
  //       //   const { date, startTime, endTime } = value;
  //       //   if (!date?.year || !date.month || !startTime || !endTime) return;

  //       //   setDraftEventOccurrence({
  //       //     startTime: new Date(
  //       //       date?.year,
  //       //       date.month - 1,
  //       //       date.day,
  //       //       startTime.hour,
  //       //       startTime.minute,
  //       //     ),
  //       //     endTime: new Date(
  //       //       date?.year,
  //       //       date.month - 1,
  //       //       date.day,
  //       //       endTime.hour,
  //       //       endTime.minute,
  //       //     ),
  //       //   });
  //       //   break;
  //       // }
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form.watch]);

  const hubItems = hubs?.map((hub) => ({ id: hub.id, name: hub.name }));
  return (
    <div className="space-y-5">
      <div className="space-y-1.5 rounded-2xl ">
        <Controller
          control={form.control}
          name="hubId"
          render={({
            field: { onChange, value, ...restField },
            fieldState: { error, invalid },
          }) => (
            <Select
              {...restField}
              placeholder="Select hub..."
              onSelectionChange={onChange}
              selectedKey={value}
              aria-label="Select Hub"
              validationBehavior="aria"
              isInvalid={invalid}
              errorMessage={error?.message}
              isDisabled={isDisabled}
            >
              <Select.Trigger
                showArrow={true}
                prefix={<Folder02Icon size={16} />}
              />
              <Select.List
                popoverProps={{
                  placement: "left top",
                  offset: 8,
                }}
                items={hubItems}
              >
                {(item) => (
                  <Select.Option id={item.id} textValue={item.name}>
                    {item.name}
                  </Select.Option>
                )}
              </Select.List>
            </Select>
          )}
        />
        <div
          className="flex flex-row items-center gap-2"
          ref={colorSwatchTriggerRef}
        >
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState: { error, invalid } }) => (
              <TextField
                {...field}
                size="small"
                aria-label="Session title"
                placeholder="Title"
                validationBehavior="aria"
                isInvalid={invalid}
                errorMessage={error?.message}
                isDisabled={isDisabled}
                className={{
                  primitive: "flex-1",
                  fieldGroup: "hover:bg-overlay-highlight",
                  input: "text-sm",
                }}
              />
            )}
          />
          <Controller
            control={form.control}
            name="color"
            render={({
              field: { onChange, value, ...restField },
              fieldState: { error, invalid },
            }) => (
              <EventColorPicker
                {...restField}
                selectedKey={value}
                onSelectionChange={onChange}
                aria-label="Event color"
                validationBehavior="aria"
                isInvalid={invalid}
                errorMessage={error?.message}
                isDisabled={isDisabled}
                popoverProps={{
                  placement: "left top",
                  offset: 8,
                  triggerRef: colorSwatchTriggerRef,
                }}
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-muted-fg">Date & Time</p>
        <Controller
          control={form.control}
          name="date"
          render={({ field, fieldState: { invalid, error } }) => (
            <DatePicker
              {...field}
              aria-label="Session date"
              validationBehavior="aria"
              isInvalid={invalid}
              errorMessage={error?.message}
              isDisabled={isDisabled}
              className={{
                fieldGroup: "hover:bg-overlay-highlight",
              }}
              overlayProps={{
                placement: "left top",
                offset: 8,
              }}
            />
          )}
        />
        <div
          ref={timeComboboxTriggerRef}
          className="flex items-center gap-2 w-full"
        >
          <Controller
            control={form.control}
            name="startTime"
            render={({ field: { onChange, value, ...restField } }) => (
              <TimeCombobox
                {...restField}
                value={value}
                onChange={onChange}
                withIcon
                isDisabled={isDisabled}
                className={{
                  input: "text-sm",
                  fieldGroup: "hover:bg-overlay-highlight",
                }}
                listProps={{
                  placement: "left top",
                  offset: 8,
                  triggerRef: timeComboboxTriggerRef,
                }}
              />
            )}
          />
          <div className="size-7 shrink-0 flex items-center justify-center bg-overlay-highlight/70 text-text-sub rounded-lg">
            <ArrowRight02Icon size={16} />
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
                isDisabled={isDisabled}
                className={{
                  input: "text-sm",
                  fieldGroup: "hover:bg-overlay-highlight",
                }}
                listProps={{
                  placement: "left top",
                  triggerRef: timeComboboxTriggerRef,
                  offset: 8,
                }}
              />
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="timezone"
          render={({
            field: { onChange, value, ...restField },
            fieldState: { error },
          }) => (
            <div ref={timezoneComboboxTriggerRef}>
              <TimezoneCombobox
                {...restField}
                onSelectionChange={onChange}
                selectedKey={value}
                aria-label="Session timezone"
                errorMessage={error?.message}
                className={{
                  fieldGroup: "hover:bg-overlay-highlight",
                  input: "text-sm",
                }}
                isDisabled={isDisabled}
                listProps={{
                  placement: "left top",
                  offset: 8,
                  triggerRef: timezoneComboboxTriggerRef,
                }}
              />
            </div>
          )}
        />
        <Controller
          control={form.control}
          name="recurrenceRule"
          render={({ field: { onChange, value } }) => (
            <RecurrenceSelect
              value={value}
              onChange={onChange}
              selectedDate={
                date
                  ? toCalendarDate(date)
                  : new CalendarDate(
                      selectedDate.year,
                      selectedDate.month,
                      selectedDate.day,
                    )
              }
            />
          )}
        />
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-muted-fg">Event description</p>
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState: { error, invalid } }) => (
            <Textarea
              {...field}
              // size={"sm"}
              aria-label="Session title"
              placeholder="Description"
              validationBehavior="aria"
              isDisabled={isDisabled}
              isInvalid={invalid}
              errorMessage={error?.message}
              className={{
                textarea: "hover:bg-overlay-highlight",
              }}
              type="textarea"
            />
          )}
        />
      </div>

      <div className="space-y-1.5 ">
        <p className="text-sm font-medium text-muted-fg">Event billing</p>
        <div className="flex flex-row items-center gap-3 w-full  h-10 px-2">
          <Controller
            control={form.control}
            name="isBillable"
            render={({ field: { value, ref, ...restField } }) => (
              <Switch
                {...restField}
                isSelected={value}
                size="small"
                isDisabled={isDisabled}
                className={"h-10 gap-0 text-sm"}
              >
                Billable
              </Switch>
            )}
          />
          {isBillable && (
            <div className="flex flex-row gap-2 items-center">
              <Controller
                control={form.control}
                name="price"
                render={({ field: { onChange, ...field } }) => (
                  <NumberField
                    {...field}
                    aria-label="Session price"
                    placeholder="Price"
                    isDisabled={isDisabled}
                    minValue={1}
                    formatOptions={{
                      style: "currency",
                      currency: "EUR",
                    }}
                    onChange={(price) => {
                      onChange(Number.isNaN(price) ? 1 : price);
                    }}
                    className={{
                      input: "text-sm",
                      fieldGroup: "hover:bg-overlay-highlight",
                    }}
                  />
                )}
              />
              <span className="text-sm text-muted-fg shrink-0">
                per session
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-muted-fg">Event participants</p>

        <Controller
          control={form.control}
          name="participants"
          render={({ field: { onChange, value, ...restField } }) => (
            <ParticipantsCombobox
              {...restField}
              value={value}
              onChange={onChange}
              isDisabled={isDisabled}
              className={{
                input: "text-sm",
                fieldGroup: "hover:bg-overlay-highlight",
              }}
            />
          )}
        />
      </div>
    </div>
  );
};
