import { use } from "react";

import { getWeekdayCardinal } from "@/lib/calendar";
import { getDayOfWeek } from "@internationalized/date";
import { format } from "date-fns";
import { RRule, Weekday } from "rrule";
import { Select } from "../../new/ui";
import { RecurrenceSelectContext } from "../recurrence-select-context";

export enum MonthlyOptionsEnum {
  ON_DAY = "on-day",
  ON_CARDINAL_DAY = "on-cardinal-day",
}

export const MonthOptionsSelect = () => {
  const { setRruleOptions, rruleOptions, selectedDate } = use(
    RecurrenceSelectContext,
  );

  const day = selectedDate.day;
  const selectedDateDate = selectedDate.toDate("UTC");
  const selectedDateDayStr = format(selectedDateDate, "do");
  const selectedDateCardinal = getWeekdayCardinal(selectedDateDate);

  const selectItems: { id: MonthlyOptionsEnum; label: string }[] = [
    {
      id: MonthlyOptionsEnum.ON_DAY,
      label: `the ${selectedDateDayStr}`,
    },
    {
      id: MonthlyOptionsEnum.ON_CARDINAL_DAY,
      label: `the ${selectedDateCardinal.label} ${format(selectedDateDate, "iii")}`,
    },
  ];

  const handleCustomRecurrence = (option: MonthlyOptionsEnum) => {
    switch (option) {
      case MonthlyOptionsEnum.ON_DAY: {
        setRruleOptions({
          ...rruleOptions,
          freq: RRule.MONTHLY,
          bymonthday: [day],
          monthlyByweekday: undefined,
        });
        break;
      }
      case MonthlyOptionsEnum.ON_CARDINAL_DAY: {
        setRruleOptions({
          ...rruleOptions,
          freq: RRule.MONTHLY,
          bymonthday: undefined,
          monthlyByweekday: [
            new Weekday(
              getDayOfWeek(selectedDate, "en-GB"),
              selectedDateCardinal.cardinal,
            ),
          ],
        });
        break;
      }
    }
  };

  return (
    <Select
      selectedKey={
        rruleOptions.monthlyByweekday
          ? MonthlyOptionsEnum.ON_CARDINAL_DAY
          : MonthlyOptionsEnum.ON_DAY
      }
      onSelectionChange={(freq) => {
        handleCustomRecurrence(freq as MonthlyOptionsEnum);
      }}
      className={"w-full"}
      aria-label="Recurrence frequency"
      validationBehavior="aria"
    >
      <Select.Trigger className="w-fit hover:bg-overlay-elevated" showArrow />
      <Select.List
        className="min-w-[var(--trigger-width)] rounded-md"
        items={selectItems}
        placement="right top"
        offset={8}
      >
        {({ id, label }) => <Select.Option id={id}>{label}</Select.Option>}
      </Select.List>
    </Select>
  );
};
