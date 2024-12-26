import {
  DatePicker,
  DatePickerContent,
} from "@/components/ui/react-aria/date-picker";
import { NumberField } from "@/components/ui/react-aria/number-field";
import { Radio, RadioGroup } from "@/components/ui/react-aria/radio-group";
import { cn } from "@/lib/utils";

export enum EndsEnum {
  ENDS_NEVER = "never",
  ENDS_ON = "on",
  ENDS_AFTER = "after",
}

export const EndsRadioGroup = () => {
  return (
    <RadioGroup value={ends} onChange={(ends) => setEnds(ends as EndsEnum)}>
      <Radio
        value={EndsEnum.ENDS_NEVER}
        className="before:shrink-0 data-[selected]:before:bg-primary-100 text-sm before:bg-elevated before:border-border hover:before:bg-elevated-highlight  data-[selected]:before:border-primary"
      >
        <p className="w-20">Never</p>
      </Radio>
      <div className="flex items-center">
        <Radio
          value={EndsEnum.ENDS_ON}
          className="before:shrink-0 data-[selected]:before:bg-primary-100 text-sm before:bg-elevated before:border-border hover:before:bg-elevated-highlight  data-[selected]:before:border-primary"
        >
          <p className="w-20">On</p>
        </Radio>
        <DatePicker
          defaultValue={selectedDate}
          onChange={(untilDate) => {
            setRruleOptions({
              ...rruleOptions,
              until: untilDate ? untilDate?.toDate("UTC") : undefined,
            });
          }}
          onBlur={() => {
            console.log(rruleOptions.until);
            if (!rruleOptions.until) {
              console.log("reset");
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
      </div>
      <div className="flex items-center">
        <Radio
          value={EndsEnum.ENDS_AFTER}
          className="before:shrink-0 data-[selected]:before:bg-primary-100 text-sm before:bg-elevated before:border-border hover:before:bg-elevated-highlight  data-[selected]:before:border-primary"
        >
          <p className="w-20">After</p>
        </Radio>
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
              ends !== EndsEnum.ENDS_AFTER && "opacity-40",
            )}
          >
            time{count === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </RadioGroup>
  );
};
