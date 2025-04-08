import { NumberField } from "../../number-field";
import type { SetRruleOptions } from "../utils";

type IntervalInputProps = {
  setRruleOptions: SetRruleOptions;
  interval?: number;
};

export const IntervalInput = ({
  setRruleOptions,
  interval,
}: IntervalInputProps) => {
  return (
    <NumberField
      onChange={(interval) => {
        setRruleOptions((prev) => ({
          ...prev,
          interval: Number.isNaN(interval) ? 1 : interval,
        }));
      }}
      size="small"
      value={interval}
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
