import { cn } from "@/lib/utils";
import type { DateValue } from "@internationalized/date";
import { SelectValue } from "react-aria-components";
import { Controller, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "../button";
import { ListBoxItem } from "../react-aria/list-box";
import { SelectField, SelectFieldContent } from "../react-aria/select-field";
import { fieldWrapperVariants } from "../react-aria/shared-styles/field-variants";
import { ResizablePanelContent, ResizablePanelRoot } from "../resizable-panel";

export const RecurrenceRuleSchema = z.object({
  frequency: z.union([
    z.literal("no-recurrence"),
    z.literal("daily"),
    z.literal("weekly"),
  ]),
  interval: z.number().optional(),
  daysOfWeek: z.array(z.number()).optional(),
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

export const RecurrenceSelect = <T extends { recurrenceRule: RecurrenceRule }>({
  form,
}: { form: UseFormReturn<{ recurrenceRule: RecurrenceRule }> }) => {
  const frequency = form.watch("recurrenceRule.frequency");

  console.log({ frequency });
  return (
    <div
      className={cn(fieldWrapperVariants({ size: "sm" }), "p-0 flex flex-col")}
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
              className="w-full justify-between font-normal rounded-lg border-0"
            >
              <SelectValue className="data-[placeholder]:text-neutral-500" />
            </Button>
            <SelectFieldContent
              className="min-w-[var(--trigger-width)]"
              items={recurrences}
            >
              {({ id, label }) => <ListBoxItem id={id}>{label}</ListBoxItem>}
            </SelectFieldContent>
          </SelectField>
        )}
      />
      <ResizablePanelRoot value={frequency ?? "no-recurrence"}>
        <ResizablePanelContent value="no-recurrence" />
        <ResizablePanelContent value="daily">
          <div className="p-3 flex flex-col gap-y-3 text-sm font-normal">
            <div className="flex flex-row items-center">
              <p className="w-16">Every</p>

              {/* <NumberField
                         onChange={(value) => {
                           field.onChange({
                             ...recurrenceRule,
                             interval: value,
                           });
                         }}
                         aria-label="Every x days"
                         step={1}
                         minValue={1}
                         value={recurrenceRule?.interval ?? 1}
                         inputSize="sm"
                         placeholder="Session title"
                         className="mr-3 max-w-[80px]"
                       /> */}
              <p>day(s)</p>
            </div>
            <p>On</p>
            <p>Ends on</p>
          </div>
        </ResizablePanelContent>
        <ResizablePanelContent value="weekly">
          <p>dsf</p>
          <p>dsf</p>
          <p>dsf</p>
          <p>dsf</p>
          <p>dsf</p>
          <p>dsf</p>
        </ResizablePanelContent>
      </ResizablePanelRoot>
    </div>
    // <FormField
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
