import { cn } from "@/lib/utils";
import { Clock01Icon } from "@hugeicons/react";
import type { Time } from "@internationalized/date";
import { createContext, use, useEffect, useState } from "react";
import { Button, Group, Input } from "react-aria-components";

import {
  type TimeSelectOption,
  formatDifferenceLabel,
  formatLabel,
  generateTimeSelectOptions,
  generateTimeValue,
  parseTimeInput,
} from "./utils";

import {
  ComboBoxField,
  ComboBoxFieldContent,
  type ComboBoxFieldContentProps,
  type ComboBoxFieldProps,
} from "@/components/ui/react-aria/combobox";
import { ListBoxItem } from "@/components/ui/react-aria/list-box";
import { fieldWrapperVariants } from "@/components/ui/react-aria/shared-styles/field-variants";

const TimeComboboxContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

type TimeComboboxProps<T extends object> = ComboBoxFieldProps<T> & {
  withIcon?: boolean;
  minValue?: Time;
  value: Time | null;
  onChange: (value: Time | null) => void;
};

export const TimeCombobox = <T extends TimeSelectOption>({
  children,
  className,
  minValue,
  withIcon = false,
  value,
  onChange,
  onBlur,
  onKeyDown,
  ...props
}: TimeComboboxProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [items, setItems] = useState(generateTimeSelectOptions(minValue));

  const handleInputParsing = (v: string) => {
    // Parse the input and set the input value
    const parsedInput = parseTimeInput(v);

    if (!parsedInput) {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputParsing(input);
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
    console.log({ minValue });
    setItems(generateTimeSelectOptions(minValue));
  }, [minValue]);

  return (
    <TimeComboboxContext.Provider value={{ isOpen, setIsOpen }}>
      <ComboBoxField
        menuTrigger="focus"
        inputValue={input}
        selectedKey={input}
        onSelectionChange={(time) => {
          setInput(time as string);
        }}
        onInputChange={setInput}
        onOpenChange={(open, trigger) => {
          if (trigger === "input") return;
          setIsOpen(open);
        }}
        onBlur={(e) => {
          handleInputParsing(input);
          onBlur?.(e);
        }}
        onKeyDown={(e) => {
          handleKeyDown(e);
          onKeyDown?.(e);
        }}
        className="min-w-0"
        allowsCustomValue
        items={items}
        {...props}
      >
        <Group
          className={cn(
            fieldWrapperVariants({ size: "sm" }),
            "block px-0 overflow-hidden pl-0 relative",
            withIcon && "pl-0",
            className,
          )}
        >
          {withIcon && (
            <Button
              className={cn(
                "absolute top-0 left-0",
                "h-full aspect-square p-0 rounded-none",
                "flex items-center justify-center",
              )}
            >
              <Clock01Icon size={16} className="text-text-sub" />
            </Button>
          )}
          <Input
            className={cn("w-full h-full truncate px-2", withIcon && "pl-10")}
            placeholder="hh:mm"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation();
              }
            }}
          />
        </Group>
        {children}
      </ComboBoxField>
    </TimeComboboxContext.Provider>
  );
};

type TimeComboboxContentProps<T extends object> = Omit<
  ComboBoxFieldContentProps<T>,
  "items" | "children"
>;

export const TimeComboboxContent = <T extends object>({
  className,
  ...props
}: TimeComboboxContentProps<T>) => {
  const { isOpen } = use(TimeComboboxContext);
  return (
    <ComboBoxFieldContent
      {...props}
      isOpen={isOpen}
      className={cn("w-50 max-h-[300px]!", className)}
    >
      {({ label, difference, isDisabled }: TimeSelectOption) => (
        <ListBoxItem id={label} textValue={`${label}`} isDisabled={isDisabled}>
          {label}
          {difference?.hours || difference?.minutes ? (
            <span className="text-text-sub text-sm">
              {formatDifferenceLabel(difference)}
            </span>
          ) : null}
        </ListBoxItem>
      )}
    </ComboBoxFieldContent>
  );
};
