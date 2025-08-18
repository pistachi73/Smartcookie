import { Select } from "../../select";
import type { SetRruleOptions } from "../utils";

type BymonthdaySelectProps = {
  setRruleOptions: SetRruleOptions;
  bymonthday: number[];
};

const monthDayItems = Array.from({ length: 31 }, (_, i) => ({
  id: i + 1,
  label: `${i + 1}`,
}));

export const BymonthdaySelect = ({
  setRruleOptions,
  bymonthday,
}: BymonthdaySelectProps) => {
  return (
    <div className="flex flex-row items-center gap-x-2">
      <Select
        onSelectionChange={(bymonthday) => {
          setRruleOptions((prev) => ({
            ...prev,
            bymonthday: [Number(bymonthday)],
          }));
        }}
        selectedKey={bymonthday[0]}
        className={"w-full"}
        aria-label="Recurrence bymonthday"
        validationBehavior="aria"
      >
        <Select.Trigger
          data-testid="bymonthday-select-trigger"
          className="w-25 hover:bg-overlay-elevated"
          showArrow
        />

        <Select.List
          className={{ popover: "min-w-(--trigger-width) rounded-md" }}
          items={monthDayItems}
          popoverProps={{
            placement: "bottom start",
          }}
        >
          {({ id, label }) => <Select.Option id={id}>{label}</Select.Option>}
        </Select.List>
      </Select>
      <span className="text-sm text-muted-fg text-nowrap">day</span>
    </div>
  );
};
