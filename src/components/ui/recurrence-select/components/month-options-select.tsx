import { cn } from "@/lib/utils";
import { use } from "react";

import { Button } from "@/components/ui/button";

import { getWeekdayCardinal } from "@/lib/calendar";
import { ArrowDown01Icon } from "@hugeicons/react";
import { getDayOfWeek } from "@internationalized/date";
import { format } from "date-fns";
import { SelectValue } from "react-aria-components";
import { RRule, Weekday } from "rrule";
import { ListBoxItem } from "../../react-aria/list-box";
import { SelectField, SelectFieldContent } from "../../react-aria/select-field";
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
    <SelectField
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
      <Button
        size={"sm"}
        variant={"outline"}
        className={cn(
          "w-40 justify-between font-normal rounded-md h-8 text-sm pr-2 hover:bg-elevated-highlight",
        )}
      >
        <SelectValue className="data-[placeholder]:text-text-sub" />
        <ArrowDown01Icon size={14} className="text-text-sub" />
      </Button>
      <SelectFieldContent
        className="min-w-[var(--trigger-width)] z-50 rounded-md"
        items={selectItems}
        placement="right top"
      >
        {({ id, label }) => (
          <ListBoxItem showCheckIcon id={id}>
            {label}
          </ListBoxItem>
        )}
      </SelectFieldContent>
    </SelectField>
  );
};
