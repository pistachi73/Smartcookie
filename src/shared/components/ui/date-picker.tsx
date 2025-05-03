"use client";

import {
  DatePicker as DatePickerPrimitive,
  type DatePickerProps as DatePickerPrimitiveProps,
  type DateValue,
  type DialogProps,
  type PopoverProps,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { cn } from "@/shared/lib/classes";
import { Calendar01Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import type { DateDuration } from "@internationalized/date";
import { useViewport } from "../layout/viewport-context/viewport-context";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { DateInput } from "./date-field";
import { Description, FieldError, FieldGroup, Label } from "./field";
import { Popover } from "./popover";
import { composeTailwindRenderProps } from "./primitive";
import { RangeCalendar } from "./range-calendar";

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

interface DatePickerOverlayProps
  extends Omit<DialogProps, "children" | "className" | "style">,
    Omit<PopoverProps, "children" | "className" | "style"> {
  className?: string | ((values: { defaultClassName?: string }) => string);
  children?: React.ReactNode;
  closeButton?: boolean;
  range?: boolean;
  visibleDuration?: DateDuration;
  pageBehavior?: "visible" | "single";
}

const DatePickerOverlay = ({
  visibleDuration = { months: 1 },
  closeButton = true,
  pageBehavior = "visible",
  range,
  ...props
}: DatePickerOverlayProps) => {
  const { down } = useViewport();
  const isMobile = down("sm");

  return (
    <Popover.Content
      showArrow={false}
      className={cn(
        "flex justify-center p-4 sm:min-w-[17rem] sm:p-2 sm:pt-3",
        visibleDuration?.months === 1 ? "sm:max-w-[17.5rem]" : "sm:max-w-none",
      )}
      {...props}
    >
      {range ? (
        <RangeCalendar
          pageBehavior={pageBehavior}
          visibleDuration={!isMobile ? visibleDuration : undefined}
        />
      ) : (
        <Calendar />
      )}
      {closeButton && (
        <div className="mx-auto flex w-full max-w-[inherit] justify-center py-2.5 sm:hidden">
          <Popover.Close shape="circle" className="w-full">
            Close
          </Popover.Close>
        </div>
      )}
    </Popover.Content>
  );
};

const DatePickerIcon = () => (
  <Button
    size="square-petite"
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
    input?: string;
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
      {...props}
      className={composeTailwindRenderProps(className?.primitive, base())}
    >
      {label && <Label isRequired={props.isRequired}>{label}</Label>}
      <FieldGroup className={cn("min-w-40", className?.fieldGroup)}>
        <DateInput
          className={datePickerInput({ className: className?.input })}
        />
        <DatePickerIcon />
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <DatePickerOverlay {...overlayProps} />
    </DatePickerPrimitive>
  );
};
export { DatePicker, DatePickerIcon, DatePickerOverlay };
export type { DatePickerProps, DateValue, ValidationResult };
