"use client";
import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
import { cn } from "@/shared/lib/classes";
import { DayColumn } from "./day-column";
import { HourColumn } from "./hour-column";
import { HourRowsColumn } from "./hour-rows-column";

export const DayView = () => {
  const selectedDate = useCalendarStore((store) => store.selectedDate);
  const visibleDates = useCalendarStore((store) => store.visibleDates);

  return (
    <div className="flex flex-col h-full relative overflow-hidden ">
      <div className="w-full flex items-center border-b">
        <div className="w-16 shrink-0 h-full flex items-center pl-3 border-r py-2">
          <p className="text-xs text-muted-fg">Time</p>
        </div>
        <div className="flex items-center w-full p-2">
          {visibleDates.map((date) => {
            const isSelected = date.equals(selectedDate);
            return (
              <p
                key={date.toString()}
                className={cn(
                  "flex-1 w-full rounded-lg p-2",
                  "flex items-center justify-center",
                  "text-xs  uppercase tabular-nums",
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
      <div className="relative flex flex-col overflow-y-scroll">
        <div className="items-stretch flex flex-auto">
          <HourColumn />
          <div className="mx-2 flex flex-row w-full h-auto relative">
            <HourRowsColumn />
            {visibleDates.map((date) => (
              <DayColumn key={date.toString()} date={date} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
