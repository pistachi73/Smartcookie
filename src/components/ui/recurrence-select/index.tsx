import { cn } from "@/lib/utils";
import { RepeatIcon } from "@hugeicons/react";
import type { DateValue } from "@internationalized/date";
import { useMemo } from "react";
import { Checkbox, CheckboxGroup, SelectValue } from "react-aria-components";
import { Controller, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "../button";
import { DatePicker } from "../react-aria/date-picker";
import { ListBoxItem } from "../react-aria/list-box";
import { NumberField } from "../react-aria/number-field";
import { SelectField, SelectFieldContent } from "../react-aria/select-field";
import { ResizablePanelContent, ResizablePanelRoot } from "../resizable-panel";
import { formatDailyRecurrenceRule, formatWeeklyRecurrenceRule } from "./utils";

export const RecurrenceRuleSchema = z.object({
  frequency: z.union([
    z.literal("no-recurrence"),
    z.literal("daily"),
    z.literal("weekly"),
  ]),
  interval: z.number().optional(),
  daysOfWeek: z.array(z.string()).optional(),
  endDate: z.custom<DateValue>().optional(),
});

export type RecurrenceRule = z.infer<typeof RecurrenceRuleSchema>;

const recurrences: { id: RecurrenceRule["frequency"]; label: string }[] = [
  {
    id: "no-recurrence",
    label: "Does not repeat",
  },
  {
    id: "daily",
    label: "Repeats daily",
  },
  {
    id: "weekly",
    label: "Repeats weekly",
  },
];

const daysOfWeekCheckboxes: { id: string; label: string }[] = [
  { id: "1", label: "M" },
  { id: "2", label: "T" },
  { id: "3", label: "W" },
  { id: "4", label: "T" },
  { id: "5", label: "F" },
  { id: "6", label: "S" },
  { id: "7", label: "S" },
];

export const RecurrenceSelect = <T extends { recurrenceRule: RecurrenceRule }>({
  form,
}: { form: UseFormReturn<object & { recurrenceRule: RecurrenceRule }> }) => {
  const frequency = form.watch("recurrenceRule.frequency") ?? "no-recurrence";
  const interval = form.watch("recurrenceRule.interval");
  const daysOfWeek = form.watch("recurrenceRule.daysOfWeek");
  const endDate = form.watch("recurrenceRule.endDate");

  const intervalError = form.formState.errors?.recurrenceRule?.interval;
  const daysOfWeekError = form.formState.errors?.recurrenceRule?.daysOfWeek;
  const endDateError = form.formState.errors?.recurrenceRule?.endDate;

  const recurrenceRuleErrors = useMemo(
    () =>
      `${intervalError?.message ?? ""} ${daysOfWeekError?.message ?? ""} ${endDateError?.message ?? ""}`.trim(),
    [intervalError, daysOfWeekError, endDateError],
  );

  const rerenderKey = useMemo(
    () =>
      `${interval}-${daysOfWeek?.join("-")}-${endDate?.toString()}${recurrenceRuleErrors}`.toString(),
    [interval, daysOfWeek, endDate, recurrenceRuleErrors],
  );

  console.log({ recurrenceRuleErrors, rerenderKey });

  return (
    <div
      className={cn(
        "p-0 flex flex-col h-auto overflow-hidden rounded-lg border",
      )}
    >
      <Controller
        control={form.control}
        name="recurrenceRule.frequency"
        render={({
          field: { onChange, value, ...restField },
          fieldState: { error, invalid },
        }) => (
          <SelectField
            {...restField}
            onSelectionChange={onChange}
            selectedKey={value}
            className={"w-full"}
            aria-label="Recurrence frequency"
            validationBehavior="aria"
            isInvalid={invalid}
            errorMessage={error?.message}
          >
            <Button
              size={"sm"}
              variant={"outline"}
              className={cn(
                "w-full justify-between font-normal rounded-lg border border-transparent transition-[border-radius] duration-[500ms]",
                frequency &&
                  frequency !== "no-recurrence" &&
                  "border-b-border rounded-b-none duration-100",
                !value && "text-neutral-500",
              )}
            >
              <SelectValue className="data-[placeholder]:text-neutral-500" />
              <RepeatIcon size={16} />
            </Button>
            <SelectFieldContent
              className="min-w-[var(--trigger-width)]"
              items={recurrences}
              placement="top"
            >
              {({ id, label }) => <ListBoxItem id={id}>{label}</ListBoxItem>}
            </SelectFieldContent>
          </SelectField>
        )}
      />
      <ResizablePanelRoot
        value={frequency}
        rerenderKey={rerenderKey}
        customHeight={frequency === "no-recurrence" ? 0 : undefined}
      >
        <ResizablePanelContent value="daily">
          <div className="p-4 flex flex-col gap-y-3 text-sm font-normal">
            <div className="flex flex-row justify-start">
              <p className="w-16 h-10 flex items-center">Every</p>

              <Controller
                control={form.control}
                name="recurrenceRule.interval"
                render={({ field, fieldState: { error, invalid } }) => (
                  <NumberField
                    {...field}
                    size={"sm"}
                    className={"mr-3 max-w-[120px]"}
                    aria-label="Every x days"
                    step={1}
                    minValue={1}
                    maxValue={99}
                    validationBehavior="aria"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                  />
                )}
              />
              <p className="h-10 flex items-center">day(s)</p>
            </div>
            <div className="flex flex-row items-start">
              <p className="w-16 h-10 flex items-center">Ends on</p>
              <Controller
                control={form.control}
                name="recurrenceRule.endDate"
                render={({ field, fieldState: { invalid, error } }) => (
                  <DatePicker
                    {...field}
                    size={"sm"}
                    className="w-[calc(var(--spacing)*10*7-6px)]"
                    label="Name"
                    validationBehavior="aria"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                  />
                )}
              />
            </div>
            <p className="text-neutral-500 text-xs">
              {formatDailyRecurrenceRule(interval, endDate)}
            </p>
          </div>
        </ResizablePanelContent>
        <ResizablePanelContent value="weekly">
          <div className="p-4 flex flex-col gap-y-3 text-sm font-normal">
            <div className="flex flex-row items-center">
              <p className="w-16">Every</p>

              <Controller
                control={form.control}
                name="recurrenceRule.interval"
                render={({ field, fieldState: { error, invalid } }) => (
                  <NumberField
                    {...field}
                    size={"sm"}
                    className={"mr-3 max-w-[80px]"}
                    aria-label="Every x days"
                    step={1}
                    minValue={1}
                    maxValue={99}
                    validationBehavior="aria"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                  />
                )}
              />
              <p>weeks(s)</p>
            </div>
            <div className="flex flex-row items-center">
              <p className="w-16">On</p>
              <Controller
                control={form.control}
                name="recurrenceRule.daysOfWeek"
                render={({ field, fieldState }) => (
                  <CheckboxGroup
                    {...field}
                    aria-label="Weekly recurrence days of week"
                    className="rounded-lg flex items-center h-10"
                  >
                    {daysOfWeekCheckboxes.map(({ id, label }) => (
                      <Checkbox
                        key={id}
                        value={id}
                        className={({ isSelected, isFocusVisible }) =>
                          cn(
                            buttonVariants({ variant: "outline" }),
                            "rounded-none p-0 text-lg",
                            "first:rounded-l-lg last:rounded-r-lg",
                            "h-full aspect-square flex items-center justify-center shrink-0",
                            "not-first:-ml-px",
                            isSelected &&
                              "dark:bg-primary-900/60 bg-primary-100/60 hover:bg-primary-100/80 dark:hover:bg-primary-900/80",
                            isFocusVisible &&
                              "focus-ring-neutral-vanilla border-neutral-500 z-10",
                          )
                        }
                      >
                        {label}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                )}
              />
            </div>
            <div className="flex flex-row items-center">
              <p className="w-16">Ends on</p>
              <Controller
                control={form.control}
                name="recurrenceRule.endDate"
                render={({ field, fieldState: { invalid, error } }) => (
                  <DatePicker
                    {...field}
                    size={"sm"}
                    className="w-[calc(var(--spacing)*10*7-6px)]"
                    label="Name"
                    validationBehavior="aria"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                  />
                )}
              />
            </div>
            <p className="text-neutral-500 text-xs">
              {formatWeeklyRecurrenceRule(interval, daysOfWeek, endDate)}
            </p>
          </div>
        </ResizablePanelContent>
      </ResizablePanelRoot>
    </div>
    //<FormField
    //   control={form.control}
    //   name={"recurrenceRule" as Path<T>}
    //   render={({ field, formState: { errors } }) => {
    //     console.log({ errors });
    //     const recurrenceRule = field.value as RecurrenceRule;
    //     const frequency = recurrenceRule?.frequency;
    //     return (
    //       <FormItem className="w-full">
    //         <div className={cn("w-full rounded-lg border")}>
    //           <FormControl>
    //             <Select
    //               onValueChange={(value) => {
    //                 field.onChange({
    //                   ...recurrenceRule,
    //                   frequency: value,
    //                 });
    //               }}
    //             >
    //               <SelectTrigger asChild>
    //                 <Button
    //                   variant={"outline"}
    //                   size={"sm"}
    //                   className={cn(
    //                     "w-full justify-between font-normal rounded-lg border border-transparent transition-[border-radius] duration-[800ms]",
    //                     frequency &&
    //                       frequency !== "no-recurrence" &&
    //                       "border-b-border rounded-b-none duration-100",
    //                     !field.value && "text-neutral-500",
    //                   )}
    //                 >
    //                   {frequency ? recurrencesMap[frequency] : "Recurrence"}
    //                   <RepeatIcon size={16} />
    //                 </Button>
    //               </SelectTrigger>

    //               <SelectContent className="w-auto">
    //                 {Object.entries(recurrencesMap).map(([key, value]) => (
    //                   <SelectItem key={key} value={key} className="text-sm">
    //                     {value}
    //                   </SelectItem>
    //                 ))}
    //               </SelectContent>
    //             </Select>
    //           </FormControl>
    //           <ResizablePanelRoot value={frequency ?? "no-recurrence"}>
    //             <ResizablePanelContent value="no-recurrence" />
    //             <ResizablePanelContent value="daily">
    //               <div className="p-3 flex flex-col gap-y-3 text-sm font-normal">
    //                 <div className="flex flex-row items-center">
    //                   <p className="w-16">Every</p>

    //                   <NumberInput
    //                     onChange={(value) => {
    //                       field.onChange({
    //                         ...recurrenceRule,
    //                         interval: value,
    //                       });
    //                     }}
    //                     aria-label="Every x days"
    //                     step={1}
    //                     minValue={1}
    //                     value={recurrenceRule?.interval ?? 1}
    //                     inputSize="sm"
    //                     placeholder="Session title"
    //                     className="mr-3 max-w-[80px]"
    //                   />
    //                   <p>day(s)</p>
    //                 </div>
    //                 <p>On</p>
    //                 <p>Ends on</p>
    //               </div>
    //             </ResizablePanelContent>
    //             <ResizablePanelContent value="weekly">
    //               <p>dsf</p>
    //               <p>dsf</p>
    //               <p>dsf</p>
    //               <p>dsf</p>
    //               <p>dsf</p>
    //               <p>dsf</p>
    //             </ResizablePanelContent>
    //           </ResizablePanelRoot>
    //         </div>
    //         <FormMessage />
    //       </FormItem>
    //     );
    //   }}
    // />
  );
};
