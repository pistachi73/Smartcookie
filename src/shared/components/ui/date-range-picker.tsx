"use client";

import {
  DateRangePicker as DateRangePickerPrimitive,
  type DateRangePickerProps as DateRangePickerPrimitiveProps,
  type DateValue,
  type ValidationResult,
} from "react-aria-components";

import { DateInput } from "@/shared/components/ui/date-field";
import {
  DatePickerIcon,
  DatePickerOverlay,
} from "@/shared/components/ui/date-picker";
import {
  Description,
  FieldError,
  FieldGroup,
  Label,
} from "@/shared/components/ui/field";
import { composeTailwindRenderProps } from "@/shared/components/ui/primitive";
import { cn } from "@/shared/lib/classes";
import type { DateDuration } from "@internationalized/date";
import type { Placement } from "react-aria";

interface DateRangePickerProps<T extends DateValue>
  extends Omit<DateRangePickerPrimitiveProps<T>, "className"> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  visibleDuration?: DateDuration;
  pageBehavior?: "visible" | "single";
  contentPlacement?: Placement;
  className?: {
    primitive?: string;
    fieldGroup?: string;
    fieldError?: string;
    fieldLabel?: string;
    fieldDescription?: string;
    fieldInput?: string;
    fieldIcon?: string;
  };
}

const DateRangePicker = <T extends DateValue>({
  label,
  className,
  description,
  errorMessage,
  contentPlacement = "bottom",
  visibleDuration = { months: 1 },
  ...props
}: DateRangePickerProps<T>) => {
  return (
    <DateRangePickerPrimitive
      {...props}
      className={composeTailwindRenderProps(
        className?.primitive,
        "group/date-range-picker flex flex-col gap-y-1",
      )}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup className={cn("w-auto min-w-40", className?.fieldGroup)}>
        <DateInput slot="start" />
        <span
          aria-hidden="true"
          className="text-fg group-disabled:text-muted-fg forced-colors:text-[ButtonText] forced-colors:group-disabled:text-[GrayText]"
        >
          –
        </span>
        <DateInput className="pr-8" slot="end" />
        <DatePickerIcon />
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <DatePickerOverlay
        placement={contentPlacement}
        visibleDuration={visibleDuration}
        range
      />
    </DateRangePickerPrimitive>
  );
};
export { DateRangePicker };
export type { DateRangePickerProps };
