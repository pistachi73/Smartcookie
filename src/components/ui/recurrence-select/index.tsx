import { ArrowRight02Icon, RepeatIcon } from "@hugeicons/react";
import type { CalendarDate } from "@internationalized/date";
import * as React from "react";
import { use, useMemo, useState } from "react";
import { Frequency, RRule, type Weekday } from "rrule";
import { z } from "zod";
import { Button, DropdownLabel, Modal, Select } from "../new/ui";
import type { PopoverProps } from "../react-aria/popover";
import type { SelectFieldProps } from "../react-aria/select-field";
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
    <div className="overflow-hidden w-fit">
      <p className="first-letter:uppercase text-left  whitespace-nowrap">
        <span>
          {rruleText.label}
          {rruleText.auxLabel && (
            <span className="text-muted-fg"> {rruleText.auxLabel}</span>
          )}
        </span>
      </p>
    </div>
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
    <>
      <div onKeyDown={(e) => e.stopPropagation()}>
        <Select
          aria-label="Recurrence Select Main"
          selectedKey={value}
          onSelectionChange={(value) => {
            handleCustomRecurrence(value as string);
          }}
        >
          <Select.Trigger
            showArrow={true}
            prefix={
              <div className="shrink-0">
                <RepeatIcon size={16} className="shrink-0" />
              </div>
            }
          >
            <SelectLabel />
          </Select.Trigger>
          <Select.List
            placement="left top"
            offset={8}
            className="max-h-[400px]"
          >
            {items.map(({ items: opt }, sectionIndex) =>
              opt.map(({ name, value, auxName }, index) => (
                <React.Fragment key={value}>
                  <Select.Option id={value} textValue={name}>
                    <DropdownLabel>
                      {name}
                      {auxName && (
                        <span className="text-muted-fg"> {auxName}</span>
                      )}
                    </DropdownLabel>
                  </Select.Option>
                  {index === opt.length - 1 && sectionIndex !== 2 && (
                    <Select.Separator />
                  )}
                </React.Fragment>
              )),
            )}
          </Select.List>
        </Select>
      </div>

      <Modal.Content
        size="md"
        isOpen={isCustomModalOpen}
        onOpenChange={setIsCustomModalOpen}
      >
        <Modal.Header>
          <Modal.Title level={2}>Custom recurrence rule</Modal.Title>
          <Modal.Description>Set custom repeat pattern</Modal.Description>
        </Modal.Header>
        <Modal.Body className="overflow-visible">
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
          </div>
        </Modal.Body>
        <Modal.Footer className="flex items-center justify-end gap-2 flex-row">
          <Button
            appearance="plain"
            size="small"
            className="text-muted-fg hover:text-current"
            onPress={() => {
              setIsCustomModalOpen(false);
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
            size="small"
            className="px-6 group"
            type="button"
            onPress={() => {
              saveCustomRecurrenceRule();
              setIsCustomModalOpen(false);
            }}
            slot="close"
          >
            Save
            <ArrowRight02Icon size={14} data-slot="icon" />
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </>
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
    <>
      <RecurrenceSelectContextProvider
        selectedDate={selectedDate}
        onChange={onChange}
        value={value}
      >
        <RecurrenceSelectContent />
      </RecurrenceSelectContextProvider>
      {/* <Modal>
        <Button>open</Button>
        <Modal.Content classNames={{ overlay: "z-2000", content: "z-20000" }}>
          diasodaso
        </Modal.Content>
      </Modal> */}
    </>
  );
};
