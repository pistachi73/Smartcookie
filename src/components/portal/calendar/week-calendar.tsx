"use client";
import { cn } from "@/lib/utils";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { useMemo } from "react";
import { useCalendarContext } from "./calendar-context";
import { CalendarRows } from "./calendar-rows";
import { HoursColumn } from "./components/hours-column";
import { SessionOccurrence } from "./components/session-occurrence";
import { getWeekDays } from "./utils";

export const WeekCalendar = () => {
  const { selectedDate, sessionOccurrences } = useCalendarContext();

  const selectedDateWeekStart = useMemo(
    () => startOfWeek(selectedDate, { weekStartsOn: 1 }),
    [selectedDate],
  );

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  return (
    <div className="flex flex-col h-full gap-2 relative overflow-hidden">
      <div className="w-full flex items-center pl-6 ">
        <div className="w-12 text-neutral-500 text-sm shrink-0 mr-2">
          GTM +1
        </div>
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <div
              key={format(day, "iiiiii")}
              className={cn(
                "flex-1 rounded-lg",
                isSelected && "bg-neutral-500/20 text-responsive-dark",
              )}
            >
              <div className="flex flex-col items-center justify-center p-1">
                <p className="text-sm text-neutral-500 lowercase">
                  {format(day, "iii")}
                </p>
                <p className="text-4xl font-medium text-responsive-dark ">
                  {day.getDate()}
                </p>
              </div>
            </div>
          );
        })}

        <div className="h-full px-2" />
      </div>
      <div className="pl-6 relative flex flex-col overflow-y-scroll">
        <div className="items-stretch flex flex-auto">
          <HoursColumn />
          <div className="flex flex-row w-full h-auto relative">
            <CalendarRows />
            {Array.from({ length: 7 }).map((_, weekDayIndex) => {
              const weekDay = addDays(selectedDateWeekStart, weekDayIndex);
              console.log({ weekDay });
              const dayOccurrences =
                sessionOccurrences?.[format(weekDay, "yyyy-MM-dd")] || [];

              return (
                <div key={`day-${weekDayIndex}`} className="flex-1 relative">
                  {dayOccurrences.map((occurrenceGroup) => {
                    const columnWidth = 100 / occurrenceGroup.length;
                    return occurrenceGroup.map((occurrence, index) => (
                      <SessionOccurrence
                        key={`${occurrence.id}-${index}`}
                        className="z-20 pr-2"
                        occurrence={occurrence}
                        style={{
                          width: `${columnWidth}%`,
                          left: `${index * columnWidth}%`, // Position each session in its own column
                        }}
                      />
                    ));
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
