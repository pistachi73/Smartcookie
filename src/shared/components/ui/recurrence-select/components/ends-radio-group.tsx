import { CalendarDate, type DateValue } from "@internationalized/date";
import type { DatePickerProps } from "react-aria-components";
import { datetime, type Options } from "rrule";

import { cn } from "@/shared/lib/classes";

import { DatePicker } from "../../date-picker";
import { NumberField } from "../../number-field";
import { Radio, RadioGroup } from "../../radio";
import { EndsEnum, type SetRruleOptions } from "../utils";

type EndsRadioGroupProps = {
  setRruleOptions: SetRruleOptions;
  ends: EndsEnum;
  setEnds: React.Dispatch<React.SetStateAction<EndsEnum>>;
  minDate: DatePickerProps<DateValue>["minValue"];
  maxDate?: DatePickerProps<DateValue>["maxValue"];
  until?: Options["until"];
  count?: Options["count"];
};

export const EndsRadioGroup = ({
  setRruleOptions,
  ends,
  setEnds,
  minDate,
  maxDate,
  until,
  count,
}: EndsRadioGroupProps) => {
  return (
    <div className="flex flex-row mt-2">
      <RadioGroup
        aria-label="Recurrence ending"
        value={ends}
        onChange={(value) => {
          const ends = value as EndsEnum;
          setEnds(ends);
        }}
        className={{
          content: "ml-4",
        }}
      >
        {/* <Radio value={EndsEnum.ENDS_NEVER} className="h-10 items-center flex">
          <p className="w-16 sm:w-20 text-base text-muted-fg">Never</p>
        </Radio> */}
        <Radio
          data-testid="ends-on-radio"
          value={EndsEnum.ENDS_ON}
          className="h-10 items-center flex"
        >
          <p
            className={cn(
              "w-16 sm:w-20 text-sm text-muted-fg",
              ends === EndsEnum.ENDS_ON && "text-fg",
            )}
          >
            On
          </p>
        </Radio>
        <Radio
          data-testid="ends-after-radio"
          value={EndsEnum.ENDS_AFTER}
          className="h-10 items-center flex"
        >
          <p
            className={cn(
              "w-16 sm:w-20 text-sm text-muted-fg",
              ends === EndsEnum.ENDS_AFTER && "text-fg",
            )}
          >
            After
          </p>
        </Radio>
      </RadioGroup>
      <div className="flex flex-col gap-2">
        {/* <div className="h-8 flex-1" /> */}
        <DatePicker
          aria-label="Ends on date"
          value={
            until
              ? new CalendarDate(
                  until?.getFullYear(),
                  until?.getMonth() + 1,
                  until?.getDate(),
                )
              : undefined
          }
          onChange={(untilDate) => {
            setRruleOptions((prev) => ({
              ...prev,
              until: untilDate
                ? datetime(untilDate.year, untilDate.month, untilDate.day)
                : undefined,
            }));
          }}
          className={{
            fieldGroup: cn(
              "text-sm",
              ends === EndsEnum.ENDS_ON && "hover:bg-overlay-elevated",
            ),
          }}
          isDisabled={ends !== EndsEnum.ENDS_ON}
          overlayProps={{
            placement: "right top",
          }}
          isDateUnavailable={(date) =>
            !!(minDate && date.compare(minDate) < 0) ||
            !!(maxDate && date.compare(maxDate) > 0)
          }
          minValue={minDate}
          maxValue={maxDate}
        />

        <div className="flex items-center gap-2">
          <NumberField
            aria-label="Ends after x days"
            onChange={(count) => {
              setRruleOptions((prev) => ({
                ...prev,
                count: Number.isNaN(count) ? 1 : count,
              }));
            }}
            value={count ?? undefined}
            defaultValue={1}
            step={1}
            minValue={1}
            maxValue={99}
            className={{
              input: "text-sm",
              fieldGroup: cn(
                "w-30 sm:w-16 ",
                ends === EndsEnum.ENDS_AFTER && "hover:bg-overlay-elevated",
              ),
            }}
            isDisabled={ends !== EndsEnum.ENDS_AFTER}
          />
          <span
            className={cn(
              "text-sm",
              ends !== EndsEnum.ENDS_AFTER && "opacity-50",
            )}
          >
            time{count === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
};
