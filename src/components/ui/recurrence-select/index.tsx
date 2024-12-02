import { cn } from "@/lib/utils";
import { RepeatIcon } from "@hugeicons/react";
import type { Path, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "../button";
import { FormControl, FormField, FormItem, FormMessage } from "../form";
import { NumberInput } from "../number-input";
import { ResizablePanelContent, ResizablePanelRoot } from "../resizable-panel";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../select";

const recurrencesMap: Record<"no-recurrence" | "daily" | "weekly", string> = {
  "no-recurrence": "Does not repeat",
  daily: "Daily",
  weekly: "Weekly",
};

const NoRecurrenceSchema = z.object({
  frequency: z.literal("no-recurrence"),
});

const DailyRecurrenceSchema = z.object({
  frequency: z.literal("daily"),
  interval: z.number(),
  endDate: z.date(),
});

const WeeklyRecurrenceSchema = z.object({
  frequency: z.literal("weekly"),
  interval: z.number(),
  daysOfWeek: z.array(z.number()),
  endDate: z.date(),
});

export const RecurrenceRuleSchema = z.object({
  frequency: z.union([
    z.literal("no-recurrence"),
    z.literal("daily"),
    z.literal("weekly"),
  ]),
  interval: z.number().optional(),
  daysOfWeek: z.array(z.number()).optional(),
  endDate: z.date().optional(),
});

export type RecurrenceRule = z.infer<typeof RecurrenceRuleSchema>;

export const RecurrenceSelect = <T extends { recurrenceRule: RecurrenceRule }>({
  form,
}: { form: UseFormReturn<T> }) => {
  return (
    <FormField
      control={form.control}
      name={"recurrenceRule" as Path<T>}
      render={({ field, formState: { errors } }) => {
        console.log({ errors });
        const recurrenceRule = field.value as RecurrenceRule;
        const frequency = recurrenceRule?.frequency;
        return (
          <FormItem className="w-full">
            <div className={cn("w-full rounded-lg border")}>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange({
                      ...recurrenceRule,
                      frequency: value,
                    });
                  }}
                >
                  <SelectTrigger asChild>
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      className={cn(
                        "w-full justify-between font-normal rounded-lg border border-transparent transition-[border-radius] duration-[800ms]",
                        frequency &&
                          frequency !== "no-recurrence" &&
                          "border-b-border rounded-b-none duration-100",
                        !field.value && "text-neutral-500",
                      )}
                    >
                      {frequency ? recurrencesMap[frequency] : "Recurrence"}
                      <RepeatIcon size={16} />
                    </Button>
                  </SelectTrigger>

                  <SelectContent className="w-auto">
                    {Object.entries(recurrencesMap).map(([key, value]) => (
                      <SelectItem key={key} value={key} className="text-sm">
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <ResizablePanelRoot value={frequency ?? "no-recurrence"}>
                <ResizablePanelContent value="no-recurrence" />
                <ResizablePanelContent value="daily">
                  <div className="p-3 flex flex-col gap-y-3 text-sm font-normal">
                    <div className="flex flex-row items-center">
                      <p className="w-16">Every</p>

                      <NumberInput
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
                      />
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
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
