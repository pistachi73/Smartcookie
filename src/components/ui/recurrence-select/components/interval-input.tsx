import { use } from "react";
import { RecurrenceSelectContext } from "../recurrence-select-context";

import { NumberField } from "@/components/ui/react-aria/number-field";

export const IntervalInput = () => {
  const { setRruleOptions, rruleOptions } = use(RecurrenceSelectContext);
  return (
    <NumberField
      onChange={(interval) => {
        setRruleOptions({
          ...rruleOptions,
          interval: Number.isNaN(interval) ? 1 : interval,
        });
      }}
      value={rruleOptions.interval}
      defaultValue={1}
      size={"sm"}
      className={"w-20 h-8 text-sm rounded-md hover:bg-elevated-highlight"}
      aria-label="Every x days"
      step={1}
      minValue={1}
      maxValue={99}
    />
  );
};
