import { cn } from "@/lib/utils";
import { use } from "react";
import { Checkbox, CheckboxGroup } from "react-aria-components";

import { buttonVariants } from "@/components/ui/button";

import { RecurrenceSelectContext } from "../recurrence-select-context";
import { daysOfWeekCheckboxes } from "../utils";

export const ByweekdayCheckboxGroup = () => {
  const { setRruleOptions, rruleOptions } = use(RecurrenceSelectContext);
  return (
    <CheckboxGroup
      value={(rruleOptions.weeklyByweekday as number[]).map((v) =>
        v.toString(),
      )}
      onChange={(byweekday) => {
        if (!byweekday.length) return;
        setRruleOptions({
          ...rruleOptions,
          weeklyByweekday: byweekday.map((v) => Number.parseInt(v)).sort(),
        });
      }}
      aria-label="Weekly recurrence days of week"
      className="rounded-md h-8 flex items-center "
    >
      {daysOfWeekCheckboxes.map(({ id, label }) => (
        <Checkbox
          key={id}
          value={id.toString()}
          className={({ isSelected, isFocusVisible }) =>
            cn(
              buttonVariants({ variant: "outline" }),
              "hover:bg-elevated-highlight",
              "rounded-none p-0 text-sm",
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
  );
};
