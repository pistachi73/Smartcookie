import type { Options } from "rrule";
import { Toggle, ToggleGroup } from "../../toggle-group";
import { type SetRruleOptions, daysOfWeekCheckboxes } from "../utils";

type ByweekdayCheckboxGroupProps = {
  setRruleOptions: SetRruleOptions;
  byweekday?: Options["byweekday"];
};

export const ByweekdayCheckboxGroup = ({
  setRruleOptions,
  byweekday,
}: ByweekdayCheckboxGroupProps) => {
  console.log({ byweekday });
  return (
    <ToggleGroup
      gap={1}
      selectionMode="multiple"
      className="flex-1 flex-wrap"
      selectedKeys={byweekday as number[]}
      aria-label="Weekly recurrence days of week"
      onSelectionChange={(value) => {
        if (value.size === 0) return;
        const values = Array.from(value);
        setRruleOptions((prev) => ({
          ...prev,
          byweekday: values.map((v) => Number.parseInt(v as string)).sort(),
        }));
      }}
    >
      {daysOfWeekCheckboxes.map(({ id, label }) => (
        <Toggle
          appearance="outline"
          key={id}
          id={id}
          size="square-petite"
          className={"data-hovered:bg-overlay-elevated size-10"}
        >
          {label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
};
