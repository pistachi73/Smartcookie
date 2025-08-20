import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  RepeatIcon,
} from "@hugeicons-pro/core-solid-rounded";
import {
  type CalendarDate,
  type DateValue,
  getDayOfWeek,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { useCallback, useEffect, useState } from "react";
import type { DatePickerProps } from "react-aria-components";
import { datetime, Frequency, RRule } from "rrule";

import { Button } from "../button";
import { Label } from "../field";
import { Modal } from "../modal";
import { BymonthdaySelect } from "./components/bymonthday-select";
import { ByweekdayCheckboxGroup } from "./components/byweekday-checkbox-group";
import { EndsRadioGroup } from "./components/ends-radio-group";
import { FrequencySelect } from "./components/frequency-select";
import { IntervalInput } from "./components/interval-input";
import { StartDaySelect } from "./components/start-day-select";
import {
  type CustomRruleOptions,
  convertCustomToRRuleOptions,
  EndsEnum,
  parseRruleText,
} from "./utils";

const ModalTrigger = ({ value }: { value?: string }) => {
  const rruleText = parseRruleText(value);

  return (
    <Button
      className="overflow-hidden w-full justify-start pr-2"
      intent="outline"
      size="sm"
    >
      <div className="shrink-0">
        <HugeiconsIcon icon={RepeatIcon} size={16} className="shrink-0" />
      </div>
      <p className="first-letter:uppercase text-left  whitespace-nowrap truncate">
        {rruleText.label}
        {rruleText.auxLabel && (
          <span className="ml-[0.5ch] text-muted-fg ">
            {rruleText.auxLabel}
          </span>
        )}
      </p>
    </Button>
  );
};

export const RecurrenceSelect = ({
  onChange,
  value,
  minDate,
  maxDate,
  label,
  selectedDate = today(getLocalTimeZone()),
  onStartDateChange,
}: {
  selectedDate?: CalendarDate;
  onChange: (rrule: string | undefined) => void;
  value?: string;
  label?: string;
  minDate?: DatePickerProps<DateValue>["minValue"];
  maxDate?: DatePickerProps<DateValue>["maxValue"];
  onStartDateChange?: (date: CalendarDate | null) => void;
}) => {
  const [rrule, setRrule] = useState<RRule | null>(
    value ? RRule.fromString(value) : null,
  );

  const [ends, setEnds] = useState<EndsEnum>(() => {
    if (rrule?.options.count) {
      return EndsEnum.ENDS_AFTER;
    }
    if (rrule?.options.until || selectedDate) {
      return EndsEnum.ENDS_ON;
    }
    return EndsEnum.ENDS_NEVER;
  });

  const [rruleOptions, setRruleOptions] = useState<CustomRruleOptions>(() => {
    const { options } = rrule ?? {};

    return {
      dstart: options?.dtstart || selectedDate.toDate("UTC"),
      freq: options?.freq || RRule.WEEKLY,
      interval: options?.interval || 1,
      byweekday:
        options?.freq === RRule.WEEKLY
          ? options?.byweekday || undefined
          : [getDayOfWeek(selectedDate, "en-GB")],
      monthlyByweekday:
        options?.freq === RRule.MONTHLY
          ? options?.byweekday || undefined
          : [getDayOfWeek(selectedDate, "en-GB")],
      bymonthday: options?.bymonthday || [selectedDate.day],
      until: options?.until || selectedDate.toDate("UTC"),
      count: options?.count || 1,
      tzid: getLocalTimeZone(),
    };
  });

  const saveCustomRecurrenceRule = useCallback(
    (options?: CustomRruleOptions) => {
      console.log({
        rruleOptions: options || rruleOptions,
        ends,
      });
      const rrule = new RRule(
        convertCustomToRRuleOptions({
          rruleOptions: options || rruleOptions,
          ends,
        }),
      );

      console.log(rrule.options.dtstart);

      setRrule(rrule);
      onChange(rrule.toString());
    },
    [onChange, rruleOptions, ends],
  );

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    const selectedDateDate = datetime(
      selectedDate.year,
      selectedDate.month,
      selectedDate.day,
    );
    const dstartTime = rruleOptions?.dstart?.getTime();

    if (selectedDateDate.getTime() === dstartTime) {
      return;
    }

    const options = {
      ...rruleOptions,
      dstart: selectedDateDate,
    };

    setRruleOptions(options);

    if (value) {
      saveCustomRecurrenceRule(options);
    }
  }, [selectedDate, saveCustomRecurrenceRule, rruleOptions, value]);

  return (
    <div className="group flex w-full flex-col gap-y-1.5">
      {label && <Label>{label}</Label>}
      <Modal>
        <ModalTrigger value={value} />
        <Modal.Content size="md" isBlurred isDismissable={false}>
          <Modal.Header>
            <Modal.Title level={2}>Custom recurrence rule</Modal.Title>
            <Modal.Description>Set custom repeat pattern</Modal.Description>
          </Modal.Header>
          <Modal.Body className="overflow-visible">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-text-sub shrink-0 w-12 font-medium">
                  Start
                </p>
                <StartDaySelect
                  setRruleOptions={setRruleOptions}
                  startDate={rruleOptions.dstart}
                  minDate={minDate}
                  maxDate={maxDate}
                  onStartDateChange={onStartDateChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-text-sub shrink-0 w-12 font-medium">
                  Every
                </p>
                <IntervalInput
                  setRruleOptions={setRruleOptions}
                  interval={rruleOptions.interval}
                />
                <FrequencySelect
                  setRruleOptions={setRruleOptions}
                  freq={rruleOptions.freq}
                  interval={rruleOptions.interval}
                />
              </div>
              {rruleOptions.freq === Frequency.WEEKLY && (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-text-sub w-12 font-medium shrink-0">
                    On
                  </p>
                  <ByweekdayCheckboxGroup
                    setRruleOptions={setRruleOptions}
                    byweekday={rruleOptions.byweekday}
                  />
                </div>
              )}
              {rruleOptions.freq === Frequency.MONTHLY && (
                <div className="flex items-start gap-2">
                  <div className="w-12 h-10 shrink-0 flex items-center">
                    <p className="text-sm font-medium">On</p>
                  </div>
                  <BymonthdaySelect
                    setRruleOptions={setRruleOptions}
                    bymonthday={rruleOptions.bymonthday}
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <p className="text-sm text-text-sub  font-medium">Ends</p>
                <EndsRadioGroup
                  setRruleOptions={setRruleOptions}
                  ends={ends}
                  setEnds={setEnds}
                  minDate={minDate}
                  maxDate={maxDate}
                  until={rruleOptions.until}
                  count={rruleOptions.count}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex items-center justify-end gap-2 flex-row">
            <Modal.Close intent="plain" size="md">
              Cancel
            </Modal.Close>
            <Modal.Close
              intent="primary"
              size="md"
              type="button"
              onPress={() => saveCustomRecurrenceRule()}
            >
              Save
              <HugeiconsIcon icon={ArrowRight02Icon} data-slot="icon" />
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
};
