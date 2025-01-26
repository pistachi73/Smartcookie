import {
  DatePicker,
  DatePickerContent,
} from "@/components/ui/react-aria/date-picker";
import { NumberField } from "@/components/ui/react-aria/number-field";
import { Radio, RadioGroup } from "@/components/ui/react-aria/radio-group";
import { cn } from "@/lib/utils";
import { CalendarDate } from "@internationalized/date";
import { use } from "react";
import { RecurrenceSelectContext } from "../recurrence-select-context";
import { EndsEnum } from "../utils";

export const EndsRadioGroup = () => {
  const { setRruleOptions, rruleOptions, selectedDate, ends, setEnds } = use(
    RecurrenceSelectContext,
  );
  return (
    <div className="flex flex-row">
      <RadioGroup
        value={ends}
        onChange={(ends) => {
          setEnds(ends as EndsEnum);
        }}
      >
        <Radio value={EndsEnum.ENDS_NEVER} className="h-8">
          <p className="w-20">Never</p>
        </Radio>
        <Radio value={EndsEnum.ENDS_ON} className="h-8">
          <p className="w-20">On</p>
        </Radio>
        <Radio value={EndsEnum.ENDS_AFTER} className="h-8">
          <p className="w-20">After</p>
        </Radio>
      </RadioGroup>
      <div className="flex flex-col gap-2">
        <div className="h-8" />
        <DatePicker
          value={
            rruleOptions?.until
              ? new CalendarDate(
                  rruleOptions?.until?.getFullYear(),
                  rruleOptions?.until?.getMonth() + 1,
                  rruleOptions?.until?.getDate(),
                )
              : selectedDate
          }
          onChange={(untilDate) => {
            setRruleOptions({
              ...rruleOptions,
              until: untilDate ? untilDate?.toDate("UTC") : undefined,
            });
          }}
          onBlur={() => {
            if (!rruleOptions.until) {
              setRruleOptions({
                ...rruleOptions,
                until: selectedDate.toDate("UTC"),
              });
            }
          }}
          className="h-8 text-sm w-32 hover:bg-elevated-highlight"
          isDisabled={ends !== EndsEnum.ENDS_ON}
        >
          <DatePickerContent
            placement="right top"
            calendarProps={{
              isDateUnavailable: (date) => date.compare(selectedDate) < 0,
            }}
          />
        </DatePicker>
        <div className="flex items-center gap-2">
          <NumberField
            onChange={(count) => {
              setRruleOptions({
                ...rruleOptions,
                count: Number.isNaN(count) ? 1 : count,
              });
            }}
            value={rruleOptions.count}
            defaultValue={1}
            size={"sm"}
            aria-label="Ends after x days"
            step={1}
            minValue={1}
            maxValue={99}
            className={
              "w-16 h-8 text-sm rounded-md hover:bg-elevated-highlight"
            }
            isDisabled={ends !== EndsEnum.ENDS_AFTER}
          />
          <span
            className={cn(
              "text-sm",
              ends !== EndsEnum.ENDS_AFTER && "opacity-60",
            )}
          >
            time{rruleOptions.count === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
};
