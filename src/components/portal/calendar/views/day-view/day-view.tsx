"use client";
import { getStartOfWeek } from "@/lib/temporal/week";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { CalendarRows } from "../../calendar-rows";
import { HoursColumn } from "../../components/hours-column";
import { getCurrentTimezone, getDayKeyFromDate } from "../../utils";
import { DayColumn } from "./day-column";

const useWeekView = () =>
  useCalendarStore(
    useShallow(({ selectedDate }) => ({
      selectedDate,
    })),
  );

type DayViewProps = {
  numberOfDays: 1 | 5 | 7;
};

export const DayView = ({ numberOfDays }: DayViewProps) => {
  const { selectedDate } = useWeekView();

  const startOfWeek = useMemo(
    () => getStartOfWeek(selectedDate),
    [selectedDate],
  );

  const days = useMemo(() => {
    return numberOfDays === 1
      ? [selectedDate]
      : Array.from({ length: numberOfDays }).map((_, i) =>
          startOfWeek.add({ days: i }),
        );
  }, [startOfWeek, selectedDate, numberOfDays]);

  const timezoneOffsetHours = useMemo(
    () => getCurrentTimezone().offsetHours,
    [],
  );

  console.log({ days });

  return (
    <div className="flex flex-col h-full relative overflow-hidden ">
      <div className="w-full flex items-center px-2 py-2 shadow-2xl  border-b">
        <div className="w-12 shrink-0 h-full mr-4 flex items-center justify-end">
          <p className="text-xs text-muted-fg">
            GTM{timezoneOffsetHours > 0 ? "+" : "-"}
            {timezoneOffsetHours}
          </p>
        </div>
        <div className="flex items-center w-full">
          {days.map((date) => {
            const isSelected = date.equals(selectedDate);
            return (
              <p
                key={date.toString()}
                className={cn(
                  "flex-1 w-full rounded-lg p-2",
                  "flex items-center justify-center",
                  "text-xs  uppercase",
                  isSelected
                    ? "text-current bg-overlay-highlight font-semibold"
                    : "text-muted-fg ",
                )}
              >
                {date.toLocaleString("en-US", { weekday: "short" })}{" "}
                {date.day.toString().padStart(2, "0")}
              </p>
            );
          })}
        </div>
      </div>
      <div className="relative flex flex-col overflow-y-scroll px-2 pt-2">
        <div className="items-stretch flex flex-auto">
          <HoursColumn />
          <div className="flex flex-row w-full h-auto relative">
            <CalendarRows />
            {days.map((date) => (
              <DayColumn key={getDayKeyFromDate(date)} date={date} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
