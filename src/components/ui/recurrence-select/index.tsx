import { getWeekdayCardinal } from "@/lib/calendar";
import { cn } from "@/lib/utils";
import { ArrowRight02Icon, RepeatIcon } from "@hugeicons/react";
import type { CalendarDate } from "@internationalized/date";
import { format } from "date-fns";
import { use, useState } from "react";
import { Heading, ListBoxSection } from "react-aria-components";
import { Frequency, RRule, type Weekday } from "rrule";
import { z } from "zod";
import { Button } from "../button";
import { Dialog } from "../react-aria/dialog";
import { ListBoxItem } from "../react-aria/list-box";
import { Modal } from "../react-aria/modal";
import {
  SelectField,
  SelectFieldContent,
  SelectTrigger,
} from "../react-aria/select-field";
import { ByweekdayCheckboxGroup } from "./components/byweekday-checkbox-group";
import { EndsRadioGroup } from "./components/ends-radio-group";
import { FrequencySelect } from "./components/frequency-select";
import { IntervalInput } from "./components/interval-input";
import { MonthOptionsSelect } from "./components/month-options-select";
import {
  RecurrenceSelectContext,
  RecurrenceSelectContextProvider,
} from "./recurrence-select-context";
import {
  EndsEnum,
  PrefefinedRecurrencesEnum,
  getPredefinedRecurrencesLabelMap,
  getPredefinedRecurrencesOptionsMap,
  parseRruleOptions,
  parseRruleText,
} from "./utils";

export const RecurrenceRuleSchema = z.object({
  freq: z.custom<Frequency>().optional(),
  interval: z.number().optional(),
  byweekday: z.array(z.custom<Weekday>()).optional(),
  count: z.number().optional(),
  until: z.custom<Date>().optional(),
});

export type RecurrenceRule = z.infer<typeof RecurrenceRuleSchema>;

const SelectLabel = ({ option }: { option: PrefefinedRecurrencesEnum }) => {
  const { selectedDate, rrule, rruleOptions } = use(RecurrenceSelectContext);
  const val = getPredefinedRecurrencesLabelMap(selectedDate)[option];
  const rruleText = parseRruleText(rrule, rruleOptions.interval ?? 1);

  const label = val?.label ?? rruleText.label;
  const auxLabel = val?.auxLabel ?? rruleText.auxLabel;

  return (
    <p className="first-letter:uppercase truncate">
      <span>
        {label}
        {auxLabel && <span className="text-text-sub"> {auxLabel}</span>}
      </span>
    </p>
  );
};

export const RecurrenceSelectContent = () => {
  const { rruleOptions, setRruleOptions, rrule, setRrule, selectedDate, ends } =
    use(RecurrenceSelectContext);

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<PrefefinedRecurrencesEnum>(
    PrefefinedRecurrencesEnum.NO_RECURRENCE,
  );
  const shortWeekdayStr = format(selectedDate.toDate("UTC"), "iii");

  const items = [
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
          value: PrefefinedRecurrencesEnum.EVERY_DAY,
          name: "Every day",
        },
        {
          value: PrefefinedRecurrencesEnum.EVERY_WEEKDAY,
          name: "Every weekday",
          auxName: "Mon - Fri",
        },
        {
          value: PrefefinedRecurrencesEnum.EVERY_WEEK_ON_SELECTED_DATE,
          name: "Every week",
          auxName: `on ${shortWeekdayStr}`,
        },
        {
          value: PrefefinedRecurrencesEnum.EVERY_MONTHDAY,
          name: "Every month",
          auxName: `on the ${format(selectedDate.toDate("UTC"), "do")}`,
        },
        {
          value: PrefefinedRecurrencesEnum.EVERY_CARDINAL_MONTHDAY,
          name: "Every month",
          auxName: `on the ${getWeekdayCardinal(selectedDate.toDate("UTC")).label} ${shortWeekdayStr}`,
        },
        {
          value: PrefefinedRecurrencesEnum.EVERY_YEARDAY,
          name: "Every year",
          auxName: `on ${format(selectedDate.toDate("UTC"), "MMM d")}`,
        },
      ],
    },
    {
      section: "custom",
      items: [{ value: PrefefinedRecurrencesEnum.CUSTOM, name: "Custom..." }],
    },
  ];

  const predefinedRecurrenceOptionsMap =
    getPredefinedRecurrencesOptionsMap(selectedDate);

  const predefinedRecurrenceLabelsMap =
    getPredefinedRecurrencesLabelMap(selectedDate);

  const handleCustomRecurrence = (option: PrefefinedRecurrencesEnum) => {
    switch (option) {
      case PrefefinedRecurrencesEnum.NO_RECURRENCE:
        setRrule(null);
        break;
      case PrefefinedRecurrencesEnum.CUSTOM:
        console.log(rruleOptions);
        setIsCustomModalOpen(true);
        break;
      default: {
        const newRruleOptions = predefinedRecurrenceOptionsMap[option];

        if (!newRruleOptions) return;

        setRruleOptions({
          ...rruleOptions,
          ...newRruleOptions,
        });

        setRrule(
          new RRule(
            parseRruleOptions({
              rruleOptions: newRruleOptions,
              ends: EndsEnum.ENDS_NEVER,
            }),
          ),
        );
        break;
      }
    }
  };

  const saveCustomRecurrenceRule = () => {
    console.log(parseRruleOptions({ rruleOptions, ends }), ends);
    setRrule(new RRule(parseRruleOptions({ rruleOptions, ends })));
    setIsCustomModalOpen(false);
  };

  return (
    <>
      <SelectField
        aria-label="Recurrence Select Main"
        selectedKey={selectedKey}
        onSelectionChange={(value) => {
          setSelectedKey(value as PrefefinedRecurrencesEnum);
          handleCustomRecurrence(value as PrefefinedRecurrencesEnum);
        }}
      >
        <SelectTrigger
          size={"sm"}
          variant={"ghost"}
          className={cn(
            "w-full font-normal rounded-lg",
            rrule ? "" : "text-text-sub",
          )}
          icon={RepeatIcon}
        >
          <div className="pr-2 truncate">
            <SelectLabel option={selectedKey} />
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
              {({ name, value, auxName }) => {
                return (
                  <ListBoxItem id={value} showCheckIcon>
                    <p>
                      {name}
                      {auxName && (
                        <span className="text-text-sub"> {auxName}</span>
                      )}
                    </p>
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
            {rruleOptions.freq === Frequency.WEEKLY && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-text-sub w-12 shrink-0">On</p>
                <ByweekdayCheckboxGroup />
              </div>
            )}
            {rruleOptions.freq === Frequency.MONTHLY && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-text-sub w-12 shrink-0">On</p>
                <MonthOptionsSelect />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <p className="text-sm text-text-sub">Ends</p>
              <EndsRadioGroup />
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
    </>
  );
};

export const RecurrenceSelect = ({
  selectedDate,
  onChange,
}: {
  selectedDate: CalendarDate;
  onChange: (rrule: string) => void;
}) => {
  return (
    <RecurrenceSelectContextProvider selectedDate={selectedDate}>
      <RecurrenceSelectContent />
    </RecurrenceSelectContextProvider>
  );
};
