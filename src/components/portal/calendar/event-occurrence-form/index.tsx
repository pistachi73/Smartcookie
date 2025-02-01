"use client";

import { ParticipantsCombobox } from "@/components/ui/participants-combobox";
import { RecurrenceSelect } from "@/components/ui/recurrence-select";

import {
  Button,
  ColorSwatch,
  ColorSwatchPicker,
  DatePicker,
  Form,
  NumberField,
  Popover,
  Select,
  Switch,
  TextField,
  Textarea,
} from "@/components/ui/new/ui";
import { TimeCombobox } from "@/components/ui/time-combobox";
import { TimezoneCombobox } from "@/components/ui/timezone-combobox";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import {
  ArrowRight02Icon,
  CalendarAdd01Icon,
  Folder02Icon,
} from "@hugeicons/react";
import { CalendarDate, toCalendarDate } from "@internationalized/date";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Controller, type UseFormReturn, useWatch } from "react-hook-form";
import type { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import type { SessionOcurrenceFormSchema } from "./schema";
import { useCreateEvent } from "./use-create-event";

const useEventOccurrenceForm = () =>
  useCalendarStore(
    useShallow((store) => ({
      hubs: store.hubs,
      selectedDate: store.selectedDate,
      setDraftEventOccurrence: store.setDraftEventOccurrence,
    })),
  );

export const SessionOccurrenceFrom = ({
  form,
  editingEventOccurrenceId,
  onCancel,
}: {
  form: UseFormReturn<z.infer<typeof SessionOcurrenceFormSchema>>;
  editingEventOccurrenceId?: number;
  onCancel: () => void;
}) => {
  const { hubs, setDraftEventOccurrence, selectedDate } =
    useEventOccurrenceForm();
  const { createEvent, isCreatingEvent } = useCreateEvent();
  const timeComboboxTriggerRef = useRef<HTMLDivElement>(null);
  const timezoneComboboxTriggerRef = useRef<HTMLDivElement>(null);
  const colorSwatchTriggerRef = useRef<HTMLDivElement>(null);
  const startTime = useWatch({
    control: form.control,
    name: "startTime",
  });

  const endTime = useWatch({
    control: form.control,
    name: "endTime",
  });

  const date = useWatch({
    control: form.control,
    name: "date",
  });

  const isBillable = useWatch({
    control: form.control,
    name: "isBillable",
  });

  useEffect(() => {
    if (!startTime || !endTime || !date) return;
    console.log("setdraftevent");

    if (editingEventOccurrenceId === -1) {
      setDraftEventOccurrence({
        eventOccurrenceId: -1,
        startTime: new Date(
          date.year,
          date.month - 1,
          date.day,
          startTime.hour,
          startTime.minute,
        ),
        endTime: new Date(
          date.year,
          date.month - 1,
          date.day,
          endTime.hour,
          endTime.minute,
        ),
      });
    }
  }, [
    setDraftEventOccurrence,
    editingEventOccurrenceId,
    date,
    startTime,
    endTime,
  ]);

  const onSubmit = (values: z.infer<typeof SessionOcurrenceFormSchema>) => {
    if (editingEventOccurrenceId === -1) {
      createEvent(values);
    }
  };

  const hubItems = hubs?.map((hub) => ({ id: hub.id, name: hub.name }));
  const isFormDisabled = isCreatingEvent;
  return (
    <Form
      onSubmit={form.handleSubmit(onSubmit)}
      className="relative h-full flex flex-col justify-between"
    >
      {/* <div className="bg-gradient-to-t from-[#30EEAC]/30 to-transparent absolute bottom-0 left-0 h-[300px] w-full" /> */}
      <div className="p-4 z-20 relative">
        <div className="flex items-center gap-3 mb-6 px-2">
          <CalendarAdd01Icon
            size={24}
            variant="duotone"
            color="var(--color-text)"
          />
          <p className="text-lg font-medium"> Create / edit session</p> 
        </div>
        <div className="space-y-5">
          <div className="space-y-1.5 rounded-2xl ">
            {/* <p className="text-sm text-muted-fg">Date & Time</p> */}

            <Controller
              control={form.control}
              name="hubId"
              render={({
                field: { onChange, value, ...restField },
                fieldState: { error, invalid },
              }) => (
                <>
                  <Select
                    {...restField}
                    placeholder="Select hub..."
                    onSelectionChange={onChange}
                    selectedKey={value}
                    aria-label="Select Hub"
                    validationBehavior="aria"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    isDisabled={isFormDisabled}
                  >
                    <Select.Trigger
                      showArrow={true}
                      prefix={<Folder02Icon size={16} />}
                    />
                    <Select.List
                      placement="left top"
                      offset={8}
                      items={hubItems}
                    >
                      {(item) => (
                        <Select.Option id={item.id} textValue={item.name}>
                          {item.name}
                        </Select.Option>
                      )}
                    </Select.List>
                  </Select>
                  {/* <SelectField
                      {...restField}
                      onSelectionChange={onChange}
                      selectedKey={value}
                      placeholder="Hub"
                      aria-label="Hub"
                      validationBehavior="aria"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      isDisabled={isFormDisabled}
                    >
                      <SelectTrigger
                        size={"sm"}
                        variant={"ghost"}
                        className={cn("w-full font-normal rounded-lg")}
                        icon={Folder02Icon}
                      />
                      <SelectFieldContent
                        placement="left top"
                        offset={12}
                        className="w-[250px]"
                        items={hubItems}
                      >
                        {({ id, name }) => (
                          <ListBoxItem id={id} showCheckIcon>
                            {name}
                          </ListBoxItem>
                        )}
                      </SelectFieldContent>
                    </SelectField> */}
                </>
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
                    isDisabled={isFormDisabled}
                    className={{
                      primitive: "flex-1",
                      fieldGroup: "hover:bg-overlay-highlight",
                      input: "text-sm",
                    }}
                  />
                )}
              />
              <Popover>
                <Button
                  appearance="outline"
                  size="square-petite"
                  shape="square"
                  className={"p-0 size-10"}
                >
                  <ColorSwatch
                    className="size-4 rounded-xs  "
                    color={"#8E24AA"}
                  />
                </Button>
                <Popover.Content
                  className="py-4 min-w-auto"
                  triggerRef={colorSwatchTriggerRef}
                  placement="left top"
                  showArrow={false}
                >
                  <Popover.Body>
                    <ColorSwatchPicker
                      aria-label="Pick color"
                      // value={value}
                      // onChange={setValue}
                      className="grid grid-cols-3 gap-3"
                    >
                      <ColorSwatchPicker.Item color="#8E24AA" />
                      <ColorSwatchPicker.Item color="#AD1457" />
                      <ColorSwatchPicker.Item color="#E64A19" />
                      <ColorSwatchPicker.Item color="#2E7D32" />
                      <ColorSwatchPicker.Item color="#00796B" />
                      <ColorSwatchPicker.Item color="#5C6BC0" />
                      <ColorSwatchPicker.Item color="#1A73E8" />
                      <ColorSwatchPicker.Item color="#673AB7" />
                      <ColorSwatchPicker.Item color="#424242" />
                    </ColorSwatchPicker>
                  </Popover.Body>
                </Popover.Content>
              </Popover>
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
                  isDisabled={isFormDisabled}
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
                    isDisabled={isFormDisabled}
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
                    isDisabled={isFormDisabled}
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
                    isDisabled={isFormDisabled}
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
                          selectedDate.getFullYear(),
                          selectedDate.getMonth() + 1,
                          selectedDate.getDate(),
                        )
                  }
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-fg">
              Event description
            </p>
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
                  isDisabled={isFormDisabled}
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
                    isDisabled={isFormDisabled}
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
                        isDisabled={isFormDisabled}
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
            <p className="text-sm font-medium text-muted-fg">
              Event participants
            </p>

            <Controller
              control={form.control}
              name="participants"
              render={({ field: { onChange, value, ...restField } }) => (
                <ParticipantsCombobox
                  {...restField}
                  value={value}
                  onChange={onChange}
                  isDisabled={isFormDisabled}
                  className={{
                    input: "text-sm",
                    fieldGroup: "hover:bg-overlay-highlight",
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 p-4">
        <Button
          appearance="plain"
          size="small"
          onPress={onCancel}
          isDisabled={isFormDisabled}
        >
          Cancel
        </Button>

        <Button
          size="small"
          className="px-6"
          type="submit"
          isDisabled={isFormDisabled}
        >
          {isCreatingEvent && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
    </Form>
  );
};
