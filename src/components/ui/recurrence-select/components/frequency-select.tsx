import { cn } from "@/lib/utils";
import { ArrowDown01Icon } from "@hugeicons/react";
import { use, useState } from "react";
import { SelectValue } from "react-aria-components";
import type { Frequency } from "rrule";

import { Button } from "@/components/ui/button";
import { ListBoxItem } from "@/components/ui/react-aria/list-box";
import {
  SelectField,
  SelectFieldContent,
} from "@/components/ui/react-aria/select-field";

import { RecurrenceSelectContext } from "../recurrence-select-context";
import { getFrequencyItems } from "../utils";

export const FrequencySelect = () => {
  const { setRruleOptions, rruleOptions } = use(RecurrenceSelectContext);
  const [frequencyItems, setFrequencyItems] = useState(getFrequencyItems(1));

  return (
    <SelectField
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
      <Button
        size={"sm"}
        variant={"outline"}
        className={cn(
          "w-26 justify-between font-normal rounded-md h-8 text-sm pr-2 hover:bg-elevated-highlight",
        )}
      >
        <SelectValue className="data-[placeholder]:text-text-sub" />
        <ArrowDown01Icon size={14} className="text-text-sub" />
      </Button>
      <SelectFieldContent
        className="min-w-[var(--trigger-width)] z-50 rounded-md"
        items={frequencyItems}
        placement="top"
      >
        {({ id, label }) => <ListBoxItem id={id}>{label}</ListBoxItem>}
      </SelectFieldContent>
    </SelectField>
  );
};
