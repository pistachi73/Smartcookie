import { cn } from "@/lib/utils";
import { Calendar01Icon } from "@hugeicons/react";
import type {
  DatePickerProps as AriaDatePickerProps,
  DateValue,
} from "react-aria-components";
import {
  DatePicker as AriaDatePicker,
  Button,
  Group,
} from "react-aria-components";
import { Calendar, type CalendarProps } from "./calendar";
import { DateInput } from "./date-input";
import { FieldDescripton } from "./field-description";
import { FieldError } from "./field-error";
import { Popover, type PopoverProps } from "./popover";
import {
  type FieldWrapperVariants,
  fieldWrapperVariants,
} from "./shared-styles/field-variants";

type DatePickerProps<T extends DateValue> = AriaDatePickerProps<T> &
  FieldWrapperVariants & {
    label?: string;
    description?: string;
    errorMessage?: string;
    calendarProps?: CalendarProps<T>;
    children?: React.ReactNode;
  };

export const DatePicker = <T extends DateValue>({
  className,
  label,
  description,
  errorMessage,
  value,
  calendarProps,
  children,
  ...props
}: DatePickerProps<T>) => {
  return (
    <AriaDatePicker {...props} value={value} className="w-full">
      <Group
        className={cn(
          fieldWrapperVariants({ size: "sm" }),
          "w-full flex flex-row items-center justify-between pl-0 overflow-hidden hover:bg-base-highlight transition-colors",
          className,
        )}
      >
        <Button
          className={cn(
            "cursor-pointer transition-colors h-full aspect-square flex items-center justify-center p-0 rounded-none  hover:bg-base-highlight",
            !value && "text-text-sub",
          )}
        >
          <Calendar01Icon size={16} className="text-text-sub" />
        </Button>
        <DateInput className={"flex-1"} />
      </Group>
      {children}
      {description && <FieldDescripton>{description}</FieldDescripton>}
      <FieldError errorMessage={errorMessage} />
    </AriaDatePicker>
  );
};

type DatePickerContentProps = Omit<PopoverProps, "children"> & {
  calendarProps?: CalendarProps<DateValue>;
};

export const DatePickerContent = ({
  calendarProps,
  ...props
}: DatePickerContentProps) => {
  return (
    <Popover {...props}>
      <Calendar {...calendarProps} />
    </Popover>
  );
};
