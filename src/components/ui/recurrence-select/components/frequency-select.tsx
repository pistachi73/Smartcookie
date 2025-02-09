import { use, useEffect, useState } from "react";
import type { Frequency } from "rrule";

import { Select } from "../../new/ui";
import { RecurrenceSelectContext } from "../recurrence-select-context";
import { getFrequencyItems } from "../utils";

export const FrequencySelect = () => {
  const { setRruleOptions, rruleOptions } = use(RecurrenceSelectContext);
  const [frequencyItems, setFrequencyItems] = useState(getFrequencyItems(1));

  useEffect(() => {
    setFrequencyItems(getFrequencyItems(rruleOptions?.interval ?? 1));
  }, [rruleOptions.interval]);

  return (
    <Select
      onSelectionChange={(freq) => {
        setRruleOptions({
          ...rruleOptions,
          freq: freq as Frequency,
        });
      }}
      selectedKey={rruleOptions.freq}
      className={"w-full"}
      aria-label="Recurrence frequency"
      validationBehavior="aria"
    >
      <Select.Trigger className="w-fit hover:bg-overlay-elevated" showArrow />

      <Select.List
        className={{ popover: "min-w-[var(--trigger-width)] rounded-md" }}
        items={frequencyItems}
        popoverProps={{
          placement: "right top",
        }}
      >
        {({ id, label }) => <Select.Option id={id}>{label}</Select.Option>}
      </Select.List>
    </Select>
  );
};
