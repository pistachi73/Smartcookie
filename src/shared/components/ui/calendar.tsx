"use client";

import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader as CalendarGridHeaderPrimitive,
  CalendarHeaderCell,
  Calendar as CalendarPrimitive,
  type CalendarProps as CalendarPrimitiveProps,
  type DateValue,
  Heading,
  Text,
  composeRenderProps,
  useLocale,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "./button";
import { composeTailwindRenderProps, focusRing } from "./primitive";

const cell = tv({
  extend: focusRing,
  base: "flex size-10 cursor-default items-center justify-center rounded-lg tabular-nums sm:size-9 sm:text-sm forced-colors:outline-0",
  variants: {
    isSelected: {
      false:
        "text-fg data-hovered:bg-secondary-fg/15 data-pressed:bg-secondary-fg/20 forced-colors:text-[ButtonText]",
      true: "bg-primary text-primary-fg data-invalid:bg-danger data-invalid:text-danger-fg forced-colors:bg-[Highlight] forced-colors:text-[Highlight] forced-colors:data-invalid:bg-[Mark]",
    },
    isDisabled: {
      true: "text-muted-fg/70 forced-colors:text-[GrayText]",
    },
    isUnavailable: {
      true: "text-muted-fg/70 forced-colors:text-[GrayText]",
    },
  },
});

interface CalendarProps<T extends DateValue>
  extends Omit<CalendarPrimitiveProps<T>, "visibleDuration"> {
  errorMessage?: string;
  className?: string;
}

const Calendar = <T extends DateValue>({
  errorMessage,
  className,
  ...props
}: CalendarProps<T>) => {
  return (
    <CalendarPrimitive
      className={composeTailwindRenderProps(
        className,
        // "max-w-[17.5rem] sm:max-w-[15.8rem]",
        "p-1",
      )}
      {...props}
    >
      <CalendarHeader />
      <CalendarGrid className="[&_td]:border-collapse [&_td]:px-0">
        <CalendarGridHeader />
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className={composeRenderProps(
                className,
                (className, renderProps) =>
                  cell({
                    ...renderProps,
                    className,
                  }),
              )}
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && (
        <Text slot="errorMessage" className="text-red-600 text-sm">
          {errorMessage}
        </Text>
      )}
    </CalendarPrimitive>
  );
};

const calendarHeaderStyles = tv({
  slots: {
    header: "flex w-full justify-center gap-1 px-1 pb-5 sm:pb-4 items-center",
    heading: "mr-2 flex-1 text-left font-medium sm:text-base font-bold",
    calendarGridHeaderCell: "font-semibold text-sm lg:text-sm",
  },
});

const { header, heading, calendarGridHeaderCell } = calendarHeaderStyles();

const CalendarHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { direction } = useLocale();

  return (
    <header
      data-slot="calendar-header"
      className={header({ className })}
      {...props}
    >
      <Heading className={heading()} />
      <div className="flex items-center gap-1">
        <Button
          size="square-petite"
          className="size-8 **:data-[slot=icon]:text-fg sm:size-7"
          shape="circle"
          appearance="plain"
          slot="previous"
        >
          {direction === "rtl" ? (
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} aria-hidden />
          ) : (
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} aria-hidden />
          )}
        </Button>
        <Button
          size="square-petite"
          className="size-8 **:data-[slot=icon]:text-fg sm:size-7"
          shape="circle"
          appearance="plain"
          slot="next"
        >
          {direction === "rtl" ? (
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} aria-hidden />
          ) : (
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} aria-hidden />
          )}
        </Button>
      </div>
    </header>
  );
};

const CalendarGridHeader = () => {
  return (
    <CalendarGridHeaderPrimitive>
      {(day) => (
        <CalendarHeaderCell className={calendarGridHeaderCell()}>
          {day}
        </CalendarHeaderCell>
      )}
    </CalendarGridHeaderPrimitive>
  );
};

Calendar.Header = CalendarHeader;
Calendar.GridHeader = CalendarGridHeader;

export { Calendar };
export type { CalendarProps };
