import { cn } from "@/lib/utils";
import { RepeatIcon } from "@hugeicons/react";
import type { DateValue } from "@internationalized/date";
import { Checkbox, CheckboxGroup, SelectValue } from "react-aria-components";
import {
  Controller,
  type UseFormReturn,
  useFormState,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "../button";
import { DatePicker } from "../react-aria/date-picker";
import { FieldError } from "../react-aria/field-error";
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

// export const RecurrenceSelect = <T extends { recurrenceRule: RecurrenceRule }>({
//   form,
// }: {
//   form: UseFormReturn<
//     object & { date: DateValue; recurrenceRule: RecurrenceRule }
//   >;
// }) => {
//   const sessionDate = useWatch({
//     control: form.control,
//     name: "date",
//     defaultValue: undefined,
//   });

//   const frequency = useWatch({
//     control: form.control,
//     name: "recurrenceRule.frequency",
//   });

//   console.log({ frequency });

//   const interval = useWatch({
//     control: form.control,
//     name: "recurrenceRule.interval",
//     defaultValue: 1,
//   });

//   const daysOfWeek = useWatch({
//     control: form.control,
//     name: "recurrenceRule.daysOfWeek",
//     defaultValue: [],
//   });

//   const endDate = useWatch({
//     control: form.control,
//     name: "recurrenceRule.endDate",
//     defaultValue: undefined,
//   });

//   const { errors } = useFormState({
//     control: form.control,
//     name: "recurrenceRule",
//   });

//   return (
//     <>
//       <div
//         className={cn(
//           "p-0 flex flex-col h-auto overflow-hidden rounded-lg border bg-background",
//         )}
//       >
//         <Controller
//           control={form.control}
//           name="recurrenceRule.frequency"
//           render={({
//             field: { onChange, value, ...restField },
//             fieldState: { error, invalid },
//           }) => (
//             <SelectField
//               {...restField}
//               onSelectionChange={onChange}
//               selectedKey={value}
//               className={"w-full"}
//               aria-label="Recurrence frequency"
//               validationBehavior="aria"
//             >
//               <Button
//                 size={"sm"}
//                 variant={"outline"}
//                 className={cn(
//                   "w-full justify-between font-normal rounded-lg border border-transparent transition-[border-radius] duration-[500ms]",
//                   frequency &&
//                     frequency !== "no-recurrence" &&
//                     "border-b-border rounded-b-none duration-100",
//                   !value && "text-neutral-500",
//                 )}
//               >
//                 <SelectValue className="data-[placeholder]:text-neutral-500" />
//                 <RepeatIcon size={16} />
//               </Button>
//               <SelectFieldContent
//                 className="min-w-[var(--trigger-width)]"
//                 items={recurrences}
//                 placement="top"
//               >
//                 {({ id, label }) => <ListBoxItem id={id}>{label}</ListBoxItem>}
//               </SelectFieldContent>
//             </SelectField>
//           )}
//         />
//         <ResizablePanelRoot
//           value={frequency}
//           customHeight={frequency === "no-recurrence" ? 0 : undefined}
//         >
//           <ResizablePanelContent value="daily">
//             <div className="p-4 flex flex-col gap-y-3 text-sm font-normal">
//               <div className="flex flex-row justify-start">
//                 <p className="w-16 h-10 flex items-center">Every</p>

//                 <Controller
//                   control={form.control}
//                   name="recurrenceRule.interval"
//                   render={({ field, fieldState: { error, invalid } }) => (
//                     <NumberField
//                       {...field}
//                       size={"sm"}
//                       className={"mr-3 max-w-[120px]"}
//                       aria-label="Every x days"
//                       step={1}
//                       minValue={1}
//                       maxValue={99}
//                       validationBehavior="aria"
//                       isInvalid={invalid}
//                       errorMessage={error?.message}
//                     />
//                   )}
//                 />
//                 <p className="h-10 flex items-center">day(s)</p>
//               </div>
//               <div className="flex flex-row items-start">
//                 <p className="w-16 h-10 flex items-center">Ends on</p>
//                 <Controller
//                   control={form.control}
//                   name="recurrenceRule.endDate"
//                   render={({ field, fieldState: { invalid, error } }) => (
//                     <DatePicker
//                       {...field}
//                       size={"sm"}
//                       className="w-[calc(var(--spacing)*10*7-6px)]"
//                       label="Name"
//                       aria-label="End date"
//                       validationBehavior="aria"
//                       isInvalid={invalid}
//                       errorMessage={error?.message}
//                       calendarProps={{
//                         isDateUnavailable: (date) =>
//                           date.compare(sessionDate) <= 0,
//                       }}
//                     />
//                   )}
//                 />
//               </div>
//               <p className="text-neutral-500 text-xs">
//                 {formatDailyRecurrenceRule(interval, endDate)}
//               </p>
//             </div>
//           </ResizablePanelContent>
//           <ResizablePanelContent value="weekly">
//             <div className="p-4 flex flex-col gap-y-3 text-sm font-normal">
//               <div className="flex flex-row justify-start">
//                 <p className="w-16 h-10 flex items-center">Every</p>
//                 <Controller
//                   control={form.control}
//                   name="recurrenceRule.interval"
//                   render={({ field, fieldState: { error, invalid } }) => (
//                     <NumberField
//                       {...field}
//                       size={"sm"}
//                       className={"mr-3 max-w-[80px]"}
//                       aria-label="Every x weeks"
//                       step={1}
//                       minValue={1}
//                       maxValue={99}
//                       validationBehavior="aria"
//                       isInvalid={invalid}
//                       errorMessage={error?.message}
//                     />
//                   )}
//                 />
//                 <p className="h-10 flex items-center">weeks(s)</p>
//               </div>

//               <div className="flex flex-row items-center">
//                 <p className="w-16">On</p>
//                 <Controller
//                   control={form.control}
//                   name="recurrenceRule.daysOfWeek"
//                   render={({ field, fieldState }) => (
//                     <CheckboxGroup
//                       {...field}
//                       aria-label="Weekly recurrence days of week"
//                       className="rounded-lg flex items-center h-10"
//                     >
//                       {daysOfWeekCheckboxes.map(({ id, label }) => (
//                         <Checkbox
//                           key={id}
//                           value={id}
//                           className={({ isSelected, isFocusVisible }) =>
//                             cn(
//                               buttonVariants({ variant: "outline" }),
//                               "rounded-none p-0 text-lg",
//                               "first:rounded-l-lg last:rounded-r-lg",
//                               "h-full aspect-square flex items-center justify-center shrink-0",
//                               "not-first:-ml-px",
//                               isSelected &&
//                                 "dark:bg-primary-900/60 bg-primary-100/60 hover:bg-primary-100/80 dark:hover:bg-primary-900/80",
//                               isFocusVisible &&
//                                 "focus-ring-neutral-vanilla border-neutral-500 z-10",
//                             )
//                           }
//                         >
//                           {label}
//                         </Checkbox>
//                       ))}
//                     </CheckboxGroup>
//                   )}
//                 />
//               </div>
//               <div className="flex flex-row items-center">
//                 <p className="w-16">Ends on</p>
//                 <Controller
//                   control={form.control}
//                   name="recurrenceRule.endDate"
//                   render={({ field, fieldState: { invalid, error } }) => (
//                     <DatePicker
//                       {...field}
//                       size={"sm"}
//                       className="w-[calc(var(--spacing)*10*7-6px)]"
//                       label="Name"
//                       aria-label="End date"
//                       validationBehavior="aria"
//                       isInvalid={invalid}
//                       errorMessage={error?.message}
//                       calendarProps={{
//                         isDateUnavailable: (date) =>
//                           date.compare(sessionDate) <= 0,
//                       }}
//                     />
//                   )}
//                 />
//               </div>
//               <p className="text-neutral-500 text-xs">
//                 {formatWeeklyRecurrenceRule(interval, daysOfWeek, endDate)}
//               </p>
//             </div>
//           </ResizablePanelContent>
//         </ResizablePanelRoot>
//       </div>
//       <FieldError errorMessage={errors.recurrenceRule?.root?.message} />
//     </>
//   );
// };

export const RecurrenceSelect = <T extends { recurrenceRule: RecurrenceRule }>({
  form,
}: {
  form: UseFormReturn<
    object & { date: DateValue; recurrenceRule: RecurrenceRule }
  >;
}) => {
  const sessionDate = useWatch({
    control: form.control,
    name: "date",
    defaultValue: undefined,
  });

  const frequency = useWatch({
    control: form.control,
    name: "recurrenceRule.frequency",
  });

  console.log({ frequency });

  const interval = useWatch({
    control: form.control,
    name: "recurrenceRule.interval",
    defaultValue: 1,
  });

  const daysOfWeek = useWatch({
    control: form.control,
    name: "recurrenceRule.daysOfWeek",
    defaultValue: [],
  });

  const endDate = useWatch({
    control: form.control,
    name: "recurrenceRule.endDate",
    defaultValue: undefined,
  });

  const { errors } = useFormState({
    control: form.control,
    name: "recurrenceRule",
  });

  return (
    <Controller
      control={form.control}
      name="recurrenceRule"
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <div
            className={cn(
              "p-0 flex flex-col h-auto overflow-hidden rounded-lg border bg-background",
            )}
          >
            <SelectField
              onSelectionChange={(frequency) =>
                onChange({ ...value, frequency })
              }
              selectedKey={value.frequency}
              className={"w-full"}
              aria-label="Recurrence frequency"
              validationBehavior="aria"
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
            <ResizablePanelRoot
              value={frequency}
              customHeight={frequency === "no-recurrence" ? 0 : undefined}
            >
              <ResizablePanelContent value="daily">
                <div className="p-4 flex flex-col gap-y-3 text-sm font-normal">
                  <div className="flex flex-row justify-start">
                    <p className="w-16 h-10 flex items-center">Every</p>
                    <NumberField
                      value={value?.interval}
                      onChange={(interval) => onChange({ ...value, interval })}
                      size={"sm"}
                      className={"mr-3 max-w-[120px]"}
                      aria-label="Every x days"
                      step={1}
                      minValue={1}
                      maxValue={99}
                    />
                    <p className="h-10 flex items-center">day(s)</p>
                  </div>
                  <div className="flex flex-row items-start">
                    <p className="w-16 h-10 flex items-center">Ends on</p>

                    <DatePicker
                      value={value?.endDate}
                      onChange={(endDate) => onChange({ ...value, endDate })}
                      size={"sm"}
                      className="w-[calc(var(--spacing)*10*7-6px)]"
                      label="Name"
                      aria-label="End date"
                      calendarProps={{
                        isDateUnavailable: (date) =>
                          date.compare(sessionDate) <= 0,
                      }}
                    />
                  </div>
                  <p className="text-neutral-500 text-xs">
                    {formatDailyRecurrenceRule(interval, endDate)}
                  </p>
                </div>
              </ResizablePanelContent>
              <ResizablePanelContent value="weekly">
                <div className="p-4 flex flex-col gap-y-3 text-sm font-normal">
                  <div className="flex flex-row justify-start">
                    <p className="w-16 h-10 flex items-center">Every</p>

                    <NumberField
                      value={value.interval}
                      onChange={(interval) => onChange({ ...value, interval })}
                      size={"sm"}
                      className={"mr-3 max-w-[80px]"}
                      aria-label="Every x weeks"
                      step={1}
                      minValue={1}
                      maxValue={99}
                    />

                    <p className="h-10 flex items-center">weeks(s)</p>
                  </div>

                  <div className="flex flex-row items-center">
                    <p className="w-16">On</p>

                    <CheckboxGroup
                      onChange={(daysOfWeek) =>
                        onChange({ ...value, daysOfWeek })
                      }
                      value={value.daysOfWeek}
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
                  </div>
                  <div className="flex flex-row items-center">
                    <p className="w-16">Ends on</p>

                    <DatePicker
                      value={value?.endDate}
                      onChange={(endDate) => onChange({ ...value, endDate })}
                      size={"sm"}
                      className="w-[calc(var(--spacing)*10*7-6px)]"
                      label="Name"
                      aria-label="End date"
                      calendarProps={{
                        isDateUnavailable: (date) =>
                          date.compare(sessionDate) <= 0,
                      }}
                    />
                  </div>
                  <p className="text-neutral-500 text-xs">
                    {formatWeeklyRecurrenceRule(interval, daysOfWeek, endDate)}
                  </p>
                </div>
              </ResizablePanelContent>
            </ResizablePanelRoot>
          </div>
          <FieldError errorMessage={error?.message} />
        </>
      )}
    />
  );
};
