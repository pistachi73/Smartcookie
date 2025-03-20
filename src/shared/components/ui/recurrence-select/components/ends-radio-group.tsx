import { cn } from "@/shared/lib/classes";
import { CalendarDate } from "@internationalized/date";
import { use } from "react";
import { DatePicker, NumberField, Radio, RadioGroup } from "../../";
import { RecurrenceSelectContext } from "../recurrence-select-context";
import { EndsEnum } from "../utils";

export const EndsRadioGroup = () => {
  const { setRruleOptions, rruleOptions, selectedDate, ends, setEnds } = use(
    RecurrenceSelectContext,
  );
  return (
    <div className="flex flex-row mt-2">
      <RadioGroup
        value={ends}
        onChange={(ends) => {
          setEnds(ends as EndsEnum);
        }}
        className={{
          content: "ml-4",
        }}
      >
        <Radio value={EndsEnum.ENDS_NEVER} className="h-10 items-center">
          <p className="w-20 text-base text-muted-fg">Never</p>
        </Radio>
        <Radio value={EndsEnum.ENDS_ON} className="h-10 items-center">
          <p className="w-20 text-base text-muted-fg">On</p>
        </Radio>
        <Radio value={EndsEnum.ENDS_AFTER} className="h-10 items-center">
          <p className="w-20 text-base text-muted-fg">After</p>
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
          className={{
            fieldGroup: cn(
              "text-sm w-32 ",
              ends === EndsEnum.ENDS_ON && "hover:bg-overlay-elevated",
            ),
          }}
          isDisabled={ends !== EndsEnum.ENDS_ON}
          overlayProps={{
            placement: "right top",
          }}
          isDateUnavailable={(date) => date.compare(selectedDate) < 0}
        />

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
            aria-label="Ends after x days"
            step={1}
            minValue={1}
            maxValue={99}
            className={{
              input: "text-sm",
              fieldGroup: cn(
                "w-16 ",
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
            time{rruleOptions.count === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
};
