"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import type { CalendarDate } from "@internationalized/date";
import { use } from "react";
import { useDateFormatter } from "react-aria";
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader as CalendarGridHeaderPrimitive,
  CalendarHeaderCell,
  Calendar as CalendarPrimitive,
  type CalendarProps as CalendarPrimitiveProps,
  CalendarStateContext,
  composeRenderProps,
  type DateValue,
  Heading,
  Text,
  useLocale,
} from "react-aria-components";
import type { CalendarState } from "react-stately";
import { tv } from "tailwind-variants";

import { Button } from "./button";
import { composeTailwindRenderProps, focusRing } from "./primitive";
import { Select } from "./select";

const cell = tv({
  extend: focusRing,
  base: "flex size-10 cursor-default items-center justify-center rounded-lg tabular-nums sm:size-9 sm:text-sm forced-colors:outline-0",
  variants: {
    isToday: {
      true: "bg-primary-tint data-today",
    },
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
  spacing?: "none" | "medium" | "large";
  showSelectors?: boolean;
}

const Calendar = <T extends DateValue>({
  errorMessage,
  className,
  spacing = "none",
  showSelectors = true,
  ...props
}: CalendarProps<T>) => {
  return (
    <CalendarPrimitive
      className={composeTailwindRenderProps(className, "")}
      {...props}
    >
      <CalendarHeader showSelectors={showSelectors} />
      <CalendarGrid
        className={`[&_td]:border-collapse ${
          spacing === "medium"
            ? "[&_td]:px-0.5 [&_td]:py-0.5"
            : spacing === "large"
              ? "[&_td]:px-1 [&_td]:py-1"
              : ""
        }`}
      >
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
    heading: "mr-2 flex-1 text-left font-medium text-base text-current",
    calendarGridHeaderCell: "font-semibold text-sm lg:text-sm",
  },
});

const { header, heading, calendarGridHeaderCell } = calendarHeaderStyles();

const CalendarHeader = ({
  className,
  isRange,
  showSelectors = true,
  ...props
}: React.ComponentProps<"header"> & {
  isRange?: boolean;
  showSelectors?: boolean;
}) => {
  const { direction } = useLocale();
  const state = use(CalendarStateContext)!;

  const formatter = useDateFormatter({
    month: "long",
    year: "numeric",
    timeZone: state.timeZone,
  });

  const currentMonthYear = formatter.format(
    state.focusedDate.toDate(state.timeZone),
  );

  return (
    <header
      data-slot="calendar-header"
      className={header({ className })}
      {...props}
    >
      {showSelectors && !isRange && (
        <>
          <SelectMonth state={state} />
          <SelectYear state={state} />
        </>
      )}

      <Heading
        className={heading({
          className: showSelectors && !isRange && "sr-only",
        })}
      />

      <div className="flex items-center gap-1">
        <Button
          size="square-petite"
          className="size-8 **:data-[slot=icon]:text-fg sm:size-7"
          shape="circle"
          intent="plain"
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
          intent="plain"
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

const SelectMonth = ({ state }: { state: CalendarState }) => {
  const months = [];

  const formatter = useDateFormatter({
    month: "long",
    timeZone: state.timeZone,
  });

  const numMonths = state.focusedDate.calendar.getMonthsInYear(
    state.focusedDate,
  );
  for (let i = 1; i <= numMonths; i++) {
    const date = state.focusedDate.set({ month: i });
    months.push(formatter.format(date.toDate(state.timeZone)));
  }
  return (
    <Select
      className="[popover-width:8rem]"
      aria-label="Select month"
      selectedKey={
        state.focusedDate.month.toString() ??
        (new Date().getMonth() + 1).toString()
      }
      onSelectionChange={(value) => {
        state.setFocusedDate(state.focusedDate.set({ month: Number(value) }));
      }}
    >
      <Select.Trigger
        showArrow
        className="h-8 w-full text-xs focus:ring-3 **:data-[slot=select-value]:inline-block **:data-[slot=select-value]:truncate group-data-open:ring-3"
      />
      <Select.List
        className={{
          list: "w-34 min-w-34 max-w-34",
          popover: "w-34 max-w-34 min-w-34",
        }}
      >
        {months.map((month, index) => (
          <Select.Option
            key={index}
            id={(index + 1).toString()}
            textValue={month}
          >
            <Select.Label>{month}</Select.Label>
          </Select.Option>
        ))}
      </Select.List>
    </Select>
  );
};

const SelectYear = ({ state }: { state: CalendarState }) => {
  const years: { value: CalendarDate; formatted: string }[] = [];
  const formatter = useDateFormatter({
    year: "numeric",
    timeZone: state.timeZone,
  });

  for (let i = -20; i <= 20; i++) {
    const date = state.focusedDate.add({ years: i });
    years.push({
      value: date,
      formatted: formatter.format(date.toDate(state.timeZone)),
    });
  }
  return (
    <Select
      aria-label="Select year"
      selectedKey={20}
      onSelectionChange={(value) => {
        // @ts-expect-error
        state.setFocusedDate(years[Number(value)]?.value);
      }}
    >
      <Select.Trigger
        showArrow
        className="h-8 text-xs focus:ring-3 group-data-open:ring-3"
      />
      <Select.List
        className={{
          list: "w-34 min-w-34 max-w-34",
          popover: "w-34 max-w-34 min-w-34",
        }}
      >
        {years.map((year, i) => (
          <Select.Option key={i} id={i} textValue={year.formatted}>
            <Select.Label>{year.formatted}</Select.Label>
          </Select.Option>
        ))}
      </Select.List>
    </Select>
  );
};

Calendar.Header = CalendarHeader;
Calendar.GridHeader = CalendarGridHeader;

export { Calendar, CalendarGridHeader, CalendarHeader };
export type { CalendarProps };
