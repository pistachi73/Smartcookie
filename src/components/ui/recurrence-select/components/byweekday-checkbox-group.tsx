import { use } from "react";

import { Toggle, ToggleGroup } from "../../";
import { RecurrenceSelectContext } from "../recurrence-select-context";
import { daysOfWeekCheckboxes } from "../utils";

export const ByweekdayCheckboxGroup = () => {
  const { setRruleOptions, rruleOptions } = use(RecurrenceSelectContext);
  return (
    <ToggleGroup
      gap={1}
      selectionMode="multiple"
      selectedKeys={(rruleOptions.weeklyByweekday as number[]).map((v) => v)}
      aria-label="Weekly recurrence days of week"
      onSelectionChange={(byweekday) => {
        console.log({ byweekday });
        if (byweekday.size === 0) return;
        const values = Array.from(byweekday);
        console.log({ values });
        setRruleOptions({
          ...rruleOptions,
          weeklyByweekday: values
            .map((v) => Number.parseInt(v as string))
            .sort(),
        });
      }}
    >
      {daysOfWeekCheckboxes.map(({ id, label }) => (
        <Toggle
          appearance="outline"
          key={id}
          id={id}
          className={"data-hovered:bg-overlay-elevated"}
        >
          {label}
        </Toggle>
      ))}
    </ToggleGroup>
    // <CheckboxGroup
    //   value={(rruleOptions.weeklyByweekday as number[]).map((v) =>
    //     v.toString(),
    //   )}
    //   onChange={(byweekday) => {
    //     if (!byweekday.length) return;
    //     setRruleOptions({
    //       ...rruleOptions,
    //       weeklyByweekday: byweekday.map((v) => Number.parseInt(v)).sort(),
    //     });
    //   }}
    //   aria-label="Weekly recurrence days of week"
    //   className="rounded-md h-8 flex items-center "
    // >
    //   {daysOfWeekCheckboxes.map(({ id, label }) => (
    //     <Checkbox
    //       key={id}
    //       value={id.toString()}
    //       className={({ isSelected, isFocusVisible }) =>
    //         cn(
    //           buttonVariants({ variant: "outline" }),
    //           "hover:bg-overlay-elevated-highlight",
    //           "rounded-none p-0 text-sm",
    //           "first:rounded-l-lg last:rounded-r-lg",
    //           "h-full aspect-square flex items-center justify-center shrink-0",
    //           "not-first:-ml-px",
    //           isSelected &&
    //             "dark:bg-primary-900/60 bg-primary-100/60 hover:bg-primary-100/80 dark:hover:bg-primary-900/80",
    //           isFocusVisible &&
    //             "focus-ring-neutral-vanilla border-neutral-500 z-10",
    //         )
    //       }
    //     >
    //       {label}
    //     </Checkbox>
    //   ))}
    // </CheckboxGroup>
  );
};
