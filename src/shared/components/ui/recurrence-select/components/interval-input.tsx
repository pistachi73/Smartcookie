import { use } from "react";
import { NumberField } from "../../";
import { RecurrenceSelectContext } from "../recurrence-select-context";

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
      size="small"
      value={rruleOptions.interval}
      defaultValue={1}
      className={{
        fieldGroup: "hover:bg-overlay-elevated",
      }}
      aria-label="Every x days"
      step={1}
      minValue={1}
      maxValue={99}
    />
  );
};
