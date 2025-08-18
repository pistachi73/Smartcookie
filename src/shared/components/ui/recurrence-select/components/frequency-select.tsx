import { useEffect, useState } from "react";
import type { Frequency } from "rrule";

import { Select } from "../../select";
import type { SetRruleOptions } from "../utils";
import { getFrequencyItems } from "../utils";

type FrequencySelectProps = {
  setRruleOptions: SetRruleOptions;
  interval?: number;
  freq?: Frequency;
};

export const FrequencySelect = ({
  setRruleOptions,
  interval,
  freq,
}: FrequencySelectProps) => {
  const [frequencyItems, setFrequencyItems] = useState(getFrequencyItems(1));

  useEffect(() => {
    setFrequencyItems(getFrequencyItems(interval || 1));
  }, [interval]);

  return (
    <Select
      onSelectionChange={(freq) => {
        setRruleOptions((prev) => ({
          ...prev,
          freq: freq as Frequency,
        }));
      }}
      selectedKey={freq}
      className={"w-full"}
      aria-label="Recurrence frequency"
      validationBehavior="aria"
    >
      <Select.Trigger
        data-testid="frequency-select-trigger"
        className="w-fit hover:bg-overlay-elevated"
        showArrow
      />

      <Select.List
        className={{ popover: "min-w-(--trigger-width) rounded-md" }}
        items={frequencyItems}
        popoverProps={{
          placement: "bottom start",
        }}
      >
        {({ id, label }) => <Select.Option id={id}>{label}</Select.Option>}
      </Select.List>
    </Select>
  );
};
