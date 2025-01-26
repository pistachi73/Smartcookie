import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/react";
import { getLocalTimeZone, isToday } from "@internationalized/date";
import { cva } from "class-variance-authority";
import type { CalendarProps as AriaCalendarProps, DateValue } from "react-aria";
import {
  Calendar as AriaCalendar,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  Heading,
  useLocale,
} from "react-aria-components";
import { cn } from "../../../lib/utils";
import { Button } from "../button";

export type CalendarProps<T extends DateValue> = AriaCalendarProps<T>;

const cellStyles = cva(
  "m-0.5 p-0 hover:text-responsive-dark hover:bg-responsive-dark/10 font-normal size-8 text-sm cursor-default rounded-full flex items-center justify-center forced-color-adjust-none",
  {
    variants: {
      isSelected: {
        true: "bg-primary-100 dark-responsive-dark hover:bg-primary-200 dark:bg-primary-800 dark:hover:bg-primary-700",
        false: "",
      },
      isDisabled: {
        true: "text-text-sub",
      },
      isUnavailable: {
        true: "opacity-30 pointer-events-none",
      },
    },
  },
);

export function Calendar<T extends DateValue>({
  errorMessage,
  ...props
}: CalendarProps<T>) {
  return (
    <AriaCalendar {...props} className="flex flex-col items-center">
      <CalendarHeader />
      <CalendarGrid className="flex flex-col items-center gap-1 ">
        <CalendarGridHeader />
        <CalendarGridBody className="w-full">
          {(date) => (
            <CalendarCell
              date={date}
              className={(props) =>
                cn(
                  buttonVariants({ variant: "ghost" }),
                  cellStyles(props),
                  isToday(date, getLocalTimeZone()) && "bg-primary text-light",
                )
              }
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </AriaCalendar>
  );
}

export function CalendarHeader() {
  const { direction } = useLocale();

  return (
    <header className="flex items-center gap-1 pb-3 px-1 w-[calc(var(--spacing)*9*7)]">
      <Button
        iconOnly
        slot="previous"
        variant={"ghost"}
        size={"sm"}
        className="size-8"
      >
        {direction === "rtl" ? (
          <ArrowRight01Icon aria-hidden size={20} />
        ) : (
          <ArrowLeft01Icon aria-hidden size={20} />
        )}
      </Button>
      <Heading className="flex-1 font-medium text-text-default text-center" />
      <Button
        iconOnly
        slot="next"
        variant={"ghost"}
        size={"sm"}
        className="size-8"
      >
        {direction === "rtl" ? (
          <ArrowLeft01Icon aria-hidden size={20} />
        ) : (
          <ArrowRight01Icon aria-hidden size={20} />
        )}
      </Button>
    </header>
  );
}

export function CalendarGridHeader() {
  return (
    <AriaCalendarGridHeader className="flex justify-between">
      {(day) => (
        <CalendarHeaderCell className="text-responsive-dark text-sm rounded-md w-9 font-medium">
          {day}
        </CalendarHeaderCell>
      )}
    </AriaCalendarGridHeader>
  );
}
