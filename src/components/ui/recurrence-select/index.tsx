import { cn } from "@/lib/utils";
import { ArrowRight02Icon, RepeatIcon } from "@hugeicons/react";
import type { CalendarDate } from "@internationalized/date";
import { use, useMemo, useState } from "react";
import { Heading, ListBoxSection } from "react-aria-components";
import { Frequency, RRule, type Weekday } from "rrule";
import { z } from "zod";
import { Button } from "../button";
import { Dialog } from "../react-aria/dialog";
import { ListBoxItem } from "../react-aria/list-box";
import { Modal } from "../react-aria/modal";
import type { PopoverProps } from "../react-aria/popover";
import {
  SelectField,
  SelectFieldContent,
  type SelectFieldProps,
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
  PrefefinedRecurrencesEnum,
  convertCustomToRRuleOptions,
  convertRRuleOptionsToCustom,
  getSelectItems,
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

const SelectLabel = () => {
  const { value } = use(RecurrenceSelectContext);

  const rruleText = parseRruleText(value);

  return (
    <p className="first-letter:uppercase truncate">
      <span>
        {rruleText.label}
        {rruleText.auxLabel && (
          <span className="text-text-sub"> {rruleText.auxLabel}</span>
        )}
      </span>
    </p>
  );
};

export const RecurrenceSelectContent = ({
  selectProps,
  popoverProps,
}: {
  selectProps?: Omit<SelectFieldProps, "children">;
  popoverProps?: Omit<PopoverProps, "children">;
}) => {
  const {
    rruleOptions,
    setRruleOptions,
    rrule,
    setRrule,
    selectedDate,
    ends,
    value,
    onChange,
  } = use(RecurrenceSelectContext);

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const items = useMemo(
    () => getSelectItems(selectedDate, value),
    [selectedDate, value],
  );

  const handleCustomRecurrence = (value: string) => {
    switch (value) {
      case PrefefinedRecurrencesEnum.NO_RECURRENCE:
        setRrule(null);
        onChange(value);
        break;
      case PrefefinedRecurrencesEnum.CUSTOM:
        setIsCustomModalOpen(true);
        break;
      default: {
        const rrule = RRule.fromString(value);

        setRruleOptions({
          ...rruleOptions,
          ...convertRRuleOptionsToCustom(rrule.options),
          dstart: selectedDate.toDate("UTC"),
        });

        setRrule(rrule);
        onChange(value);
        break;
      }
    }
  };

  const saveCustomRecurrenceRule = () => {
    const rrule = new RRule(
      convertCustomToRRuleOptions({
        rruleOptions: {
          ...rruleOptions,
          dstart: selectedDate.toDate("UTC"),
        },
        ends,
      }),
    );

    setRrule(rrule);
    onChange(rrule.toString());
    setIsCustomModalOpen(false);
  };

  return (
    <div onKeyDown={(e) => e.stopPropagation()}>
      <SelectField
        aria-label="Recurrence Select Main"
        selectedKey={value}
        onSelectionChange={(value) => {
          handleCustomRecurrence(value as string);
        }}
        {...selectProps}
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
            <SelectLabel />
          </div>
        </SelectTrigger>
        <SelectFieldContent
          placement="left top"
          offset={4}
          className="w-fit p-0"
          {...popoverProps}
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
      <Modal
        isOpen={isCustomModalOpen}
        onOpenChange={setIsCustomModalOpen}
        isKeyboardDismissDisabled
      >
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
                onPress={() => {
                  if (rrule === null) return;

                  setRruleOptions({
                    ...rruleOptions,
                    ...convertRRuleOptionsToCustom(rrule.options),
                    dstart: selectedDate.toDate("UTC"),
                  });
                }}
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
    </div>
  );
};

export const RecurrenceSelect = ({
  selectedDate,
  onChange,
  value,
  children,
}: {
  selectedDate: CalendarDate;
  onChange: (rrule: string | undefined) => void;
  value?: string;
  children?: React.ReactNode;
}) => {
  return (
    <RecurrenceSelectContextProvider
      selectedDate={selectedDate}
      onChange={onChange}
      value={value}
    >
      {children ?? <RecurrenceSelectContent />}
    </RecurrenceSelectContextProvider>
  );
};
