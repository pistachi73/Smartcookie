import type { Time } from "@internationalized/date";
import { useEffect, useState } from "react";

import {
  type TimeSelectOption,
  formatDifferenceLabel,
  formatLabel,
  generateTimeSelectOptions,
  generateTimeValue,
  parseTimeInput,
} from "./utils";

import { cn } from "@/shared/lib/classes";
import { Clock01Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComboBox,
  type ComboBoxListProps,
  type ComboBoxProps,
} from "../combo-box";
import { DropdownLabel } from "../dropdown";

type TimeComboboxProps<T extends object> = Omit<
  ComboBoxProps<T>,
  "className" | "children"
> & {
  withIcon?: boolean;
  minValue?: Time;
  value: Time | null;
  onChange: (value: Time | null) => void;
  className?: {
    primitive?: string;
    input?: string;
    fieldGroup?: string;
    overlay?: string;
  };
  listProps?: ComboBoxListProps<T>;
};

export const TimeCombobox = <T extends TimeSelectOption>({
  className,
  minValue,
  withIcon = false,
  value,
  onChange,
  onBlur,
  isDisabled,
  listProps,
}: TimeComboboxProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState(
    value ? formatLabel(value.hour, value.minute) : "",
  );
  const [items, setItems] = useState(generateTimeSelectOptions(minValue));

  const handleInputParsing = (v: string) => {
    // Parse the input and set the input value
    const parsedInput = parseTimeInput(v);

    if (!parsedInput) {
      console.log("set input without parsed", value);
      setInput(value ? formatLabel(value.hour, value.minute) : "");
    } else {
      const timeValue = generateTimeValue(
        parsedInput.hour,
        parsedInput.minute,
        minValue,
      );

      onChange(timeValue);
      setInput(formatLabel(timeValue.hour, timeValue.minute));
    }
  };

  useEffect(() => {
    if (!value) return;
    const timeValue = generateTimeValue(value.hour, value.minute, minValue);

    // If the value is less than the minValue, change the value
    if (minValue && value.compare(minValue) < 0) {
      onChange(timeValue);
    }

    setInput(formatLabel(timeValue.hour, timeValue.minute));
  }, [value, minValue, onChange]);

  useEffect(() => {
    if (!minValue) return;
    setItems(generateTimeSelectOptions(minValue));
  }, [minValue]);

  return (
    <ComboBox
      placeholder="hh:mm"
      menuTrigger="focus"
      inputValue={input}
      selectedKey={input}
      onFocus={() => setIsOpen(true)}
      onSelectionChange={(time) => {
        if (time) {
          setInput(time as string);
          handleInputParsing(time as string);
        } else {
          handleInputParsing(input as string);
        }
        setIsOpen(false);
      }}
      onInputChange={setInput}
      onOpenChange={(open, trigger) => {
        if (!trigger || trigger === "input") return;
        setIsOpen(open);
      }}
      onBlur={(e) => {
        handleInputParsing(input);
        onBlur?.(e);
        setIsOpen(false);
      }}
      className={cn("min-w-0", className?.primitive)}
      allowsCustomValue
      isDisabled={isDisabled}
      items={items}
    >
      <ComboBox.Input
        prefix={
          withIcon && (
            <HugeiconsIcon
              icon={Clock01Icon}
              size={14}
              className="text-text-sub"
            />
          )
        }
        className={{
          input: className?.input,
          fieldGroup: className?.fieldGroup,
          icon: isOpen ? "rotate-180 text-fg" : "text-muted-fg",
        }}
        value={input}
        onKeyDown={(e) => {
          console.log(e.key, isOpen);
          if (e.key === "Escape") {
            e.stopPropagation();
          }
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      />
      <ComboBox.List
        items={items}
        isOpen={isOpen}
        className={{
          popoverContent: cn("w-50 max-h-[300px]!", className?.overlay),
        }}
        {...listProps}
      >
        {({ label, difference, isDisabled }) => (
          <ComboBox.Option id={label} textValue={label} isDisabled={isDisabled}>
            <DropdownLabel>
              <span className="mr-2">{label}</span>
              {difference?.hours || difference?.minutes ? (
                <span className="text-muted-fg text-sm">
                  {formatDifferenceLabel(difference)}
                </span>
              ) : null}
            </DropdownLabel>
          </ComboBox.Option>
        )}
      </ComboBox.List>
    </ComboBox>
  );
};
