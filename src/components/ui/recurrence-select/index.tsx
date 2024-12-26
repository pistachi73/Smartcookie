import { cn } from "@/lib/utils";
import { ArrowRight02Icon, RepeatIcon } from "@hugeicons/react";
import { CalendarDate, getDayOfWeek } from "@internationalized/date";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { Heading, ListBoxSection } from "react-aria-components";
import { Frequency, Options, RRule, Weekday, type WeekdayStr } from "rrule";
import { z } from "zod";
import { Button } from "../button";
import { DatePicker, DatePickerContent } from "../react-aria/date-picker";
import { Dialog } from "../react-aria/dialog";
import { ListBoxItem } from "../react-aria/list-box";
import { Modal } from "../react-aria/modal";
import { NumberField } from "../react-aria/number-field";
import { Radio, RadioGroup } from "../react-aria/radio-group";
import {
  SelectField,
  SelectFieldContent,
  SelectTrigger,
} from "../react-aria/select-field";
import { ByweekdayCheckboxGroup } from "./components/byweekday-checkbox-group";
import { FrequencySelect } from "./components/frequency-select";
import { IntervalInput } from "./components/interval-input";
import { Test } from "./components/test";
import { RecurrenceSelectContextProvider } from "./recurrence-select-context";
import {
  EndsEnum,
  type NonNullableRruleOptions,
  PrefefinedRecurrencesEnum,
  getFrequencyItems,
} from "./utils";

export const RecurrenceRuleSchema = z.object({
  freq: z.custom<Frequency>().optional(),
  interval: z.number().optional(),
  byweekday: z.array(z.custom<Weekday>()).optional(),
  count: z.number().optional(),
  until: z.custom<Date>().optional(),
});

export type RecurrenceRule = z.infer<typeof RecurrenceRuleSchema>;

type RecurrenceSelectItem = {
  value: string;
  name: string;
};

type RecurrenceSelectSection = {
  section: string;
  items: RecurrenceSelectItem[];
};

export const RecurrenceSelect = ({
  selectedDate,
  onChange,
}: {
  selectedDate: CalendarDate;
  onChange: (rrule: string) => void;
}) => {
  const selectedDateWeekdayStr = useMemo(
    () =>
      new Weekday(getDayOfWeek(selectedDate, "en-GB")).toString() as WeekdayStr,
    [selectedDate],
  );

  console.log({
    selectedDateDay: selectedDate.day,
    selectedDateUTC: selectedDate.toDate("UTC"),
  });
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [rruleOptions, setRruleOptions] = useState<
    Partial<NonNullableRruleOptions>
  >({
    freq: RRule.WEEKLY,
    interval: 1,
    byweekday: [getDayOfWeek(selectedDate, "en-GB")],
    until: selectedDate.toDate("UTC"),
  });

  const [freq, setFreq] = useState<Frequency | undefined>(RRule.WEEKLY);
  const [interval, setInterval] = useState<number | undefined>(1);
  const [count, setCount] = useState<number | undefined>(1);
  const [until, setUntil] = useState<CalendarDate | null>(selectedDate);
  const [ends, setEnds] = useState<EndsEnum>(EndsEnum.ENDS_NEVER);
  const [byweekday, setByweekday] = useState<WeekdayStr[] | undefined>([
    selectedDateWeekdayStr,
  ]);
  const [rrule, setRrule] = useState<RRule | null>(null);

  const [text, setText] = useState<string | null>(null);
  const [auxText, setAuxText] = useState<string | null>(null);

  const selectedDateDate = selectedDate.toDate("UTC");

  const [items, setItems] = useState<RecurrenceSelectSection[]>([
    {
      section: "no-repeat",
      items: [
        {
          value: PrefefinedRecurrencesEnum.NO_RECURRENCE,
          name: "Does not repeat",
        },
      ],
    },
    {
      section: "predefined",
      items: [
        {
          value: PrefefinedRecurrencesEnum.EVERY_WEEKDAY,
          name: "Every weekday",
        },
        {
          value: PrefefinedRecurrencesEnum.EVERY_WEEK_ON_SELECTED_DATE,
          name: `Every week on ${format(selectedDateDate, "iii")}`,
        },
      ],
    },
    {
      section: "custom",
      items: [{ value: PrefefinedRecurrencesEnum.CUSTOM, name: "Custom..." }],
    },
  ]);

  const [frequencyItems, setFrequencyItems] = useState(getFrequencyItems(1));

  useEffect(() => {
    setFrequencyItems(getFrequencyItems(interval ?? 1));
    if (!interval) setInterval(1);
  }, [interval]);

  useEffect(() => {
    if (!count) setCount(1);
  }, [count]);

  const generateRrule = () => {
    let rrule: RRule | null = null;
    console.log({ freq, interval, ends, until, count, byweekday });
    if (freq) {
      const options: Partial<Options> = {
        freq,
        interval: interval || 1,
        ...(ends === EndsEnum.ENDS_ON && { until: until?.toDate("UTC") }),
        ...(ends === EndsEnum.ENDS_AFTER && { count }),
        ...(freq === RRule.WEEKLY &&
          byweekday?.length && {
            byweekday: byweekday.map((v) => new Weekday(v.toString())),
          }),
      };

      console.log(options);
      rrule = new RRule(options);
    }
    return rrule;
  };

  const handleCustomRecurrence = (option: PrefefinedRecurrencesEnum) => {
    if (option === PrefefinedRecurrencesEnum.EVERY_WEEKDAY) {
      setFreq(RRule.WEEKLY);
      setByweekday(["MO", "TU", "WE", "TH", "FR"]);
      const rrule = generateRrule();
      setRrule(rrule);
      setText("Every weekday");
      setAuxText("Mon - Fri");
    } else if (
      option === PrefefinedRecurrencesEnum.EVERY_WEEK_ON_SELECTED_DATE
    ) {
      setFreq(RRule.WEEKLY);
      setByweekday([selectedDateWeekdayStr]);
      const rrule = generateRrule();
      setRrule(rrule);
      setText("Every week");
      setAuxText(`on ${format(selectedDate.toDate("UTC"), "iii")}`);
    } else if (option === PrefefinedRecurrencesEnum.CUSTOM) {
      setIsCustomModalOpen(true);
    }
  };

  const saveCustomRecurrenceRule = () => {
    const rrule = generateRrule();
    console.log(rrule?.toString());
    if (!rrule) return;
    setRrule(rrule);
    setText(rrule.toText());
    setIsCustomModalOpen(false);
  };

  useEffect(() => {
    console.log(rruleOptions);
  }, [rruleOptions]);

  const untilCalendarDate = useMemo(() => {
    if (!rruleOptions.until) return null;
    return new CalendarDate(
      rruleOptions.until.getFullYear(),
      rruleOptions.until.getMonth() + 1,
      rruleOptions.until.getDate(),
    );
  }, [rruleOptions.until]);

  return (
    <RecurrenceSelectContextProvider selectedDate={selectedDate}>
      <Test />
      <button
        type="button"
        onClick={() => {
          const rrrule = new RRule({
            freq: RRule.MONTHLY,
            interval: 2,
            byweekday: [1, 2, 3, 4, 5],
          });

          console.log(
            rrrule.toText(
              (t) => {
                console.log(t);
                return t;
              },
              {
                dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                monthNames: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
              },
              (year, month, day) => {
                console.log({ year, month, day });
              },
            ),
          );
        }}
      >
        test
      </button>
      <SelectField
        placeholder="Recurrence"
        aria-label="Hub"
        validationBehavior="aria"
        onSelectionChange={(value) => {
          handleCustomRecurrence(value as PrefefinedRecurrencesEnum);
        }}
      >
        <SelectTrigger
          size={"sm"}
          variant={"ghost"}
          className={cn(
            "w-full font-normal rounded-lg ",
            "data-[pressed]:border-base",
            "data-[pressed]:bg-base-highlight",
            "overflow-hidden",
            text ? "" : "text-text-sub",
          )}
          icon={RepeatIcon}
        >
          <div className="pr-2 overflow-ellipsis">
            {rrule ? <p>{rrule?.toText()}</p> : "Recurrence"}
          </div>
        </SelectTrigger>
        <SelectFieldContent
          placement="left top"
          offset={4}
          className="w-[250px] p-0"
          items={items}
        >
          {({ section, items }) => (
            <ListBoxSection
              id={section}
              items={items}
              className="not-last:border-b not-last:py-1 p-1"
            >
              {({ name, value }) => {
                return (
                  <ListBoxItem id={value} showCheckIcon>
                    {name}
                  </ListBoxItem>
                );
              }}
            </ListBoxSection>
          )}
        </SelectFieldContent>
      </SelectField>
      <Modal isOpen={isCustomModalOpen} onOpenChange={setIsCustomModalOpen}>
        <Dialog>
          <Heading slot="title" className="mb-4">
            Custom recurrence rule
          </Heading>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-text-sub shrink-0 w-12">Every</p>
              <IntervalInput />
              <FrequencySelect />
            </div>
            {freq === Frequency.WEEKLY && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-text-sub w-12 shrink-0">On</p>
                <ByweekdayCheckboxGroup />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <p className="text-sm text-text-sub">Ends</p>
              <RadioGroup
                value={ends}
                onChange={(ends) => setEnds(ends as EndsEnum)}
              >
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
                        isDateUnavailable: (date) =>
                          date.compare(selectedDate) < 0,
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
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                slot="close"
                className="text-text-sub"
                onPress={() => setIsCustomModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="px-6 group"
                type="button"
                onPress={saveCustomRecurrenceRule}
              >
                Save
                <ArrowRight02Icon size={14} />
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </RecurrenceSelectContextProvider>
  );
};
