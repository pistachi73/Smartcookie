"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon } from "@hugeicons-pro/core-solid-rounded";
import dynamic from "next/dynamic";
import {
  DatePicker as DatePickerPrimitive,
  type DatePickerProps as DatePickerPrimitiveProps,
  type DateValue,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { cn } from "@/shared/lib/classes";

import { Button } from "../button";
import { DateInput } from "../date-field";
import { Description, FieldError, FieldGroup, Label } from "../field";
import { composeTailwindRenderProps } from "../primitive";
import type { DatePickerOverlayProps } from "./date-picker-overlay";

const DynamicDatePickerOverlay = dynamic(
  () => import("./date-picker-overlay").then((mod) => mod.DatePickerOverlay),
  {
    ssr: false,
  },
);

const datePickerStyles = tv({
  slots: {
    base: "group flex flex-col gap-y-1.5",
    datePickerIcon:
      "group mr-1 h-7 w-8 rounded outline-offset-0data-hovered:bg-transparent data-pressed:bg-transparent **:data-[slot=icon]:text-muted-fg",
    calendarIcon: "group-open:text-fg",
    datePickerInput: "w-full px-3 text-base sm:text-sm",
    dateRangePickerInputStart: "px-3 text-base sm:text-sm",
    dateRangePickerInputEnd: "flex-1 px-2 py-1.5 text-base sm:text-sm",
    dateRangePickerDash:
      "text-fg group-data-disabled:opacity-50 forced-colors:text-[ButtonText] forced-colors:group-data-disabled:text-[GrayText]",
  },
});

const { base, datePickerIcon, calendarIcon, datePickerInput } =
  datePickerStyles();

const DatePickerIcon = () => (
  <Button
    size="sq-sm"
    intent="plain"
    className={cn(datePickerIcon(), "aspect-square shrink-0")}
  >
    <HugeiconsIcon
      icon={Calendar01Icon}
      size={14}
      data-slot="icon"
      aria-hidden
      className={calendarIcon()}
    />
  </Button>
);

interface DatePickerProps<T extends DateValue>
  extends Omit<DatePickerPrimitiveProps<T>, "className"> {
  label?: string;
  description?: string;
  className?: {
    primitive?: string;
    fieldGroup?: string;
  };
  errorMessage?: string | ((validation: ValidationResult) => string);
  overlayProps?: DatePickerOverlayProps;
}

const DatePicker = <T extends DateValue>({
  label,
  className,
  description,
  errorMessage,
  overlayProps,
  ...props
}: DatePickerProps<T>) => {
  return (
    <DatePickerPrimitive
      validationBehavior="aria"
      {...props}
      className={composeTailwindRenderProps(className?.primitive, base())}
    >
      {label && <Label isRequired={props.isRequired}>{label}</Label>}
      <FieldGroup className={cn("min-w-40", className?.fieldGroup)}>
        <DateInput className={datePickerInput()} />
        <DatePickerIcon />
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <DynamicDatePickerOverlay {...overlayProps} />
    </DatePickerPrimitive>
  );
};
export { DatePicker, DatePickerIcon };
export type { DatePickerProps, DateValue, ValidationResult };
