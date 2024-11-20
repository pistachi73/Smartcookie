"use client";

import type React from "react";
import { type CalendarWeek, DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/react";
import { addDays, isAfter, isBefore } from "date-fns";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row sm:space-y-0 relative",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "font-medium",
        nav: "space-x-1 flex items-center  w-full grow absolute h-7 z-10",
        button_previous: cn(
          buttonVariants({ variant: "ghost", iconOnly: true }),
          "absolute left-1 size-8 bg-transparent hover:opacity-100 text-neutral-500",
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", iconOnly: true }),
          "absolute right-1 size-8 bg-transparent hover:opacity-100 text-neutral-500",
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex px-1",
        weekday: "text-responsive-dark text-sm rounded-md w-8 font-normal ",
        week: "flex w-full mt-2",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "text-sm p-0 size-8 rounded-full flex items-center justify-center  font-normal hover:text-responsive-dark hover:bg-neutral-500/30",
          "aria-selected:bg-primary-100  aria-selected:dark-responsive-dark aria-selected:hover:bg-primary-200",
          "aria-selected:dark:bg-primary-800 aria-selected:dark:hover:bg-primary-700",
        ),
        day_button: "size-8",
        range_end: "day-range-end",
        today: "!bg-primary !text-light",
        outside:
          "day-outside text-neutral-500 aria-selected:bg-neutral-500/30 aria-selected:text-muted-foreground",
        disabled: "text-neutral-500/30 opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        week_number: "text-responsive-dark",
        ...classNames,
      }}
      components={{
        Chevron: (props) => {
          console.log(props);
          if (props.orientation === "left") {
            return <ArrowLeft01Icon size={20} />;
          }
          return <ArrowRight01Icon size={20} />;
        },
        Week: ({
          week,
          children,
        }: { week: CalendarWeek; children: React.ReactNode }) => {
          let isWeekSelected = false;
          const { days } = week;
          const { mode } = props;
          if (mode === "single") {
            const { selected } = props;
            const endDate = addDays(days[6]?.date as Date, 1);
            const startDate = addDays(days[0]?.date as Date, -1);
            if (selected && startDate && endDate) {
              isWeekSelected =
                isAfter(selected, startDate) && isBefore(selected, endDate);
            }
          }

          return (
            <tr
              className={cn(
                "flex w-full h-10 items-center px-1 transition-colors duration-300",
                isWeekSelected ? "bg-neutral-500/10 rounded-3xl" : "",
              )}
            >
              {children}
            </tr>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
