"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { Time } from "@internationalized/date";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  TimeField as TimeFieldPrimitive,
  type TimeFieldProps as TimeFieldPrimitiveProps,
  type TimeValue,
  type ValidationResult,
} from "react-aria-components";

import { Button } from "./button";
import { DateInput } from "./date-field";
import { Description, FieldError, FieldGroup, Label } from "./field";
import { composeTailwindRenderProps } from "./primitive";
import { Select } from "./select";

function generateTimeOptions(): Array<{ id: string; value: string }> {
  const options: Array<{ id: string; value: string }> = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      options.push({ id: timeString, value: timeString });
    }
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();

type TimeOption = { id: string; value: string; disabled?: boolean };

function getTimeOptionsWithCurrentValue(
  currentValue?: TimeValue,
  minValue?: TimeValue,
  maxValue?: TimeValue,
): TimeOption[] {
  const options = [...TIME_OPTIONS];

  if (currentValue) {
    const currentTimeString = `${currentValue.hour.toString().padStart(2, "0")}:${currentValue.minute.toString().padStart(2, "0")}`;
    const isInDefaultOptions = TIME_OPTIONS.some(
      (option) => option.value === currentTimeString,
    );

    if (!isInDefaultOptions) {
      // Find the correct position to insert the current time
      const currentMinutes = currentValue.hour * 60 + currentValue.minute;
      const insertIndex = options.findIndex((option) => {
        const parts = option.value.split(":");
        const hour = Number(parts[0]);
        const minute = Number(parts[1]);
        const optionMinutes = hour * 60 + minute;
        return optionMinutes > currentMinutes;
      });

      if (insertIndex === -1) {
        // If no position found, append to the end
        options.push({ id: currentTimeString, value: currentTimeString });
      } else {
        // Insert at the correct position
        options.splice(insertIndex, 0, {
          id: currentTimeString,
          value: currentTimeString,
        });
      }
    }
  }

  // Apply min/max range filtering and mark disabled options
  return options.map((option) => {
    const parts = option.value.split(":");
    const hour = Number(parts[0]);
    const minute = Number(parts[1]);
    const optionMinutes = hour * 60 + minute;

    let disabled = false;

    if (minValue) {
      const minMinutes = minValue.hour * 60 + minValue.minute;
      if (optionMinutes < minMinutes) {
        disabled = true;
      }
    }

    if (maxValue) {
      const maxMinutes = maxValue.hour * 60 + maxValue.minute;
      if (optionMinutes > maxMinutes) {
        disabled = true;
      }
    }

    return {
      ...option,
      disabled,
    };
  });
}

interface TimeFieldWithSelectProps<T extends TimeValue>
  extends TimeFieldPrimitiveProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  value?: T;
  minValue?: TimeValue;
  maxValue?: TimeValue;
}

const TimeFieldWithSelect = <T extends TimeValue>({
  prefix,
  suffix,
  label,
  className,
  description,
  errorMessage,
  onChange,
  value,
  minValue,
  maxValue,
  ...props
}: TimeFieldWithSelectProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<string>("100%");

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(`${width}px`);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <TimeFieldPrimitive
      {...props}
      value={value}
      onChange={onChange}
      ref={containerRef}
      className={composeTailwindRenderProps(
        className,
        "group/time-field flex flex-col gap-y-1",
      )}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup>
        {prefix && typeof prefix === "string" ? (
          <span className="ml-2 text-muted-fg">{prefix}</span>
        ) : (
          prefix
        )}
        <div className="flex flex-1 items-center gap-2">
          <DateInput className="flex-1 min-w-0 p-2 text-sm" />
          <TimeSelect
            onChange={onChange}
            containerWidth={containerWidth}
            currentValue={value}
            minValue={minValue}
            maxValue={maxValue}
          />
        </div>
        {suffix ? (
          typeof suffix === "string" ? (
            <span className="mr-2 text-muted-fg">{suffix}</span>
          ) : (
            suffix
          )
        ) : null}
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </TimeFieldPrimitive>
  );
};

interface TimeSelectProps<T extends TimeValue> {
  onChange?: (value: T | null) => void;
  containerWidth?: string;
  currentValue?: TimeValue;
  minValue?: TimeValue;
  maxValue?: TimeValue;
}

const TimeSelect = <T extends TimeValue>({
  onChange,
  containerWidth,
  currentValue,
  minValue,
  maxValue,
}: TimeSelectProps<T>) => {
  const timeOptions = useMemo(
    () => getTimeOptionsWithCurrentValue(currentValue, minValue, maxValue),
    [currentValue, minValue, maxValue],
  );

  // Get the current selected value as a string
  const selectedValue = currentValue
    ? `${currentValue.hour.toString().padStart(2, "0")}:${currentValue.minute.toString().padStart(2, "0")}`
    : undefined;

  const handleTimeSelect = (timeString: string) => {
    if (!onChange) return;

    const parts = timeString.split(":");
    const hour = Number(parts[0]);
    const minute = Number(parts[1]);

    if (
      !Number.isNaN(hour) &&
      !Number.isNaN(minute) &&
      hour >= 0 &&
      hour < 24 &&
      minute >= 0 &&
      minute < 60
    ) {
      const timeValue = new Time(hour, minute);
      onChange(timeValue as T);
    }
  };

  return (
    <Select
      className="group flex flex-col w-fit"
      selectedKey={selectedValue}
      onSelectionChange={(key) => {
        if (typeof key === "string") {
          handleTimeSelect(key);
        }
      }}
    >
      <Button
        size="square-petite"
        intent="plain"
        className="group mr-1 size-8 rounded-sm outline-offset-0data-hovered:bg-transparent data-pressed:bg-transparent **:data-[slot=icon]:text-muted-fg aspect-square shrink-0"
        excludeFromTabOrder
      >
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={14}
          data-slot="icon"
          aria-hidden
          className={"group-open:text-fg"}
        />
      </Button>

      <Select.List
        items={timeOptions}
        className={{
          list: "max-h-80",
        }}
        popoverProps={{
          showArrow: false,
          respectScreen: false,
          style: { width: containerWidth },
          placement: "top end",
          offset: 8,
          crossOffset: 4,
        }}
      >
        {(time) => (
          <Select.Option
            key={time.id}
            id={time.id}
            className={`text-sm tabular-nums ${
              time.disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            isDisabled={time.disabled}
          >
            {time.value}
          </Select.Option>
        )}
      </Select.List>
    </Select>
  );
};

export { TimeFieldWithSelect };
export type { TimeFieldWithSelectProps };
