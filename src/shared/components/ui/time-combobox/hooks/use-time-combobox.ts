import type { Time } from "@internationalized/date";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Key } from "react-aria-components";
import {
  formatLabel,
  generateTimeSelectOptions,
  generateTimeValue,
  parseTimeInput,
} from "../utils";

interface UseTimeComboboxProps {
  value: Time | null;
  minValue?: Time;
  onChange: (value: Time | null) => void;
}

export const useTimeCombobox = ({
  value,
  minValue,
  onChange,
}: UseTimeComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState(
    value ? formatLabel(value.hour, value.minute) : "",
  );

  // Memoize time options to prevent recalculation on every render
  const items = useMemo(() => generateTimeSelectOptions(minValue), [minValue]);

  const handleInputParsing = useCallback(
    (inputValue: string) => {
      const parsedInput = parseTimeInput(inputValue);

      if (!parsedInput) {
        setInput(value ? formatLabel(value.hour, value.minute) : "");
        return;
      }

      const timeValue = generateTimeValue(
        parsedInput.hour,
        parsedInput.minute,
        minValue,
      );

      onChange(timeValue);
      setInput(formatLabel(timeValue.hour, timeValue.minute));
    },
    [value, minValue, onChange],
  );

  // Update input when value changes
  useEffect(() => {
    if (!value) return;
    const timeValue = generateTimeValue(value.hour, value.minute, minValue);

    if (minValue && value.compare(minValue) < 0) {
      onChange(timeValue);
    }

    setInput(formatLabel(timeValue.hour, timeValue.minute));
  }, [value, minValue, onChange]);

  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      if (key) {
        setInput(key.toString());
        handleInputParsing(key.toString());
      } else {
        handleInputParsing(input);
      }
      setIsOpen(false);
    },
    [input, handleInputParsing],
  );

  const handleOpenChange = useCallback((open: boolean, trigger?: string) => {
    if (!trigger || trigger === "input") return;
    setIsOpen(open);
  }, []);

  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      handleInputParsing(input);
      setIsOpen(false);
    },
    [input, handleInputParsing],
  );

  return {
    isOpen,
    input,
    items,
    handleSelectionChange,
    handleOpenChange,
    handleBlur,
    setInput,
    setIsOpen,
  };
};
