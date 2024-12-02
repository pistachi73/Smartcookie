"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  RecurrenceRuleSchema,
  RecurrenceSelect,
} from "@/components/ui/recurrence-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TimeInput } from "@/components/ui/time-input";
import { ComboBoxItem, MyComboBox } from "@/components/ui/time-select";
import { TimezoneSelect } from "@/components/ui/timezone-select";
import { getCurrentTimezone } from "@/components/ui/timezone-select/utils";
import type { SessionOccurrence } from "@/lib/generate-session-ocurrences";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight02Icon,
  CalendarAdd01Icon,
  Clock01Icon,
  Folder02Icon,
} from "@hugeicons/react";
import { format } from "date-fns";
import { type UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { useCalendarContext } from "../../calendar-context";
import { DateSelect } from "./date-select";

type SessionUpdateFormProps = {
  sessionOcurrence?: SessionOccurrence;
};

const timeSelectOptions = Array.from({ length: 24 * 4 }, (_, index) => {
  const hours = Math.floor(index / 4);
  const minutes = (index % 4) * 15;
  const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  return { value: time, label: time };
});

const sessionHour = z.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);

const SessionUpdateSchema = z.object({
  hubId: z.number(),
  title: z.string(),
  date: z.date(),
  startHour: sessionHour,
  endHour: sessionHour,
  timezone: z.string(),
  recurrenceRule: RecurrenceRuleSchema,
});

export type SesionUpdateForm = UseFormReturn<
  z.infer<typeof SessionUpdateSchema>
>;

export const SessionUpdateForm = ({
  sessionOcurrence,
}: SessionUpdateFormProps) => {
  const { hubsMap } = useCalendarContext();
  const form = useForm<z.infer<typeof SessionUpdateSchema>>({
    resolver: zodResolver(SessionUpdateSchema),
    defaultValues: {
      hubId: sessionOcurrence?.hubId,
      title: sessionOcurrence?.title ?? "",
      date: sessionOcurrence?.startTime,
      startHour: sessionOcurrence?.startTime
        ? format(sessionOcurrence?.startTime, "HH:mm")
        : undefined,
      endHour: sessionOcurrence?.endTime
        ? format(sessionOcurrence?.endTime, "HH:mm")
        : undefined,
      timezone: getCurrentTimezone()?.name ?? "",
      recurrenceRule: sessionOcurrence?.recurrenceRule ?? {
        frequency: "no-recurrence",
        interval: 1,
      },
    },

    mode: "onChange",
  });

  const startHour = form.watch("startHour");

  const filteredEndTimeOptions = timeSelectOptions.filter(({ value }) => {
    return startHour ? value > startHour : true;
  });

  const handleSubmit = (values: any) => {};

  return (
    <Form {...form}>
      <form className="space-y-6 max-w-[400px]">
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

            <FormField
              control={form.control}
              name="hubId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(value) => field.onChange(+value)}
                    defaultValue={field.value as any}
                  >
                    <FormControl>
                      <SelectTrigger asChild>
                        <Button
                          variant={"outline"}
                          size={"sm"}
                          className={cn(
                            "w-full justify-between text-left font-normal bg-transparent rounded-lg",
                            !field.value && "text-neutral-500",
                          )}
                        >
                          {field.value
                            ? hubsMap?.[field.value]?.name
                            : "Select hub"}
                          <Folder02Icon size={16} />
                        </Button>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(hubsMap ?? {}).map(([hubId, hub]) => (
                        <SelectContent key={hubId}>
                          <SelectItem value={hubId} className="text-sm">
                            {hub.name}
                          </SelectItem>
                        </SelectContent>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      inputSize="sm"
                      placeholder="Session title"
                      className="w-full py-0 "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium">Date and time</p>
            <DateSelect form={form} />
            <div className="flex items-center gap-2 w-full">
              <FormField
                control={form.control}
                name="startHour"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const endTime = form.getValues("endHour");
                        if (endTime && value >= endTime) {
                          form.setValue("endHour", "");
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger asChild>
                          <Button
                            variant={"outline"}
                            size={"sm"}
                            className={cn(
                              "w-full justify-between text-left font-normal bg-transparent rounded-lg",
                              !field.value && "text-neutral-500",
                            )}
                          >
                            {field.value ? field.value : <span>Start</span>}
                            <Clock01Icon size={16} />
                          </Button>
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent className="w-auto p-0">
                        {timeSelectOptions.map(({ value, label }) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="tabular-nums"
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="size-7 shrink-0 flex items-center justify-center dark:bg-neutral-700 bg-neutral-300 dark:text-neutral-200 text-neutral-600 rounded-lg">
                <ArrowRight02Icon size={16} />
              </div>
              <FormField
                control={form.control}
                name="endHour"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger asChild>
                          <Button
                            variant={"outline"}
                            size={"sm"}
                            className={cn(
                              "w-full justify-between text-left font-normal bg-transparent rounded-lg",
                              !field.value && "text-neutral-500",
                            )}
                          >
                            {field.value ? field.value : <span>End</span>}
                            <Clock01Icon size={16} />
                          </Button>
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent className="w-auto p-0">
                        {filteredEndTimeOptions.map(({ value, label }) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="tabular-nums"
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <TimezoneSelect form={form} />
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium">Recurrence</p>
            <RecurrenceSelect form={form} />
            hello
          </div>
        </div>

        <TimeInput inputSize={"sm"} className={"w-full"} />
        <MyComboBox
          menuTrigger="focus"
          items={[
            {
              id: "1",
              label: "One",
            },
            {
              id: "2",
              label: "Two",
            },
          ]}
        >
          {(item) => (
            <ComboBoxItem
              key={item.id}
              className={({ isFocused, isSelected }) =>
                `my-item ${isFocused ? "focused" : ""} ${
                  isSelected ? "selected" : ""
                }`
              }
            >
              {item.label}
            </ComboBoxItem>
          )}
        </MyComboBox>
      </form>
    </Form>
  );
};
