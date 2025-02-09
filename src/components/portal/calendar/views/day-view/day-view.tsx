"use client";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { CalendarRows } from "../../calendar-rows";
import { DayEventsColumn } from "../../components/day-events-column";
import { HoursColumn } from "../../components/hours-column";
import { getEventOccurrenceDayKey } from "../../utils";
import { DayViewDraftOccurrence } from "./day-view-draft-occurrence";
import { DayViewOccurrence } from "./day-view-occurrence";

const useWeekView = () =>
  useCalendarStore(
    useShallow(({ selectedDate, groupedEventOccurrences }) => ({
      selectedDate,
      groupedEventOccurrences,
    })),
  );

type DayViewProps = {
  numberOfDays: 1 | 5 | 7;
};

export const DayView = ({ numberOfDays }: DayViewProps) => {
  const { selectedDate, groupedEventOccurrences } = useWeekView();

  const selectedDateWeekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });

  const days = useMemo(() => {
    console.log("render days");

    return numberOfDays === 1
      ? [selectedDate]
      : Array.from({ length: numberOfDays }).map((_, i) =>
          addDays(selectedDateWeekStart, i),
        );
  }, [selectedDateWeekStart, numberOfDays, selectedDate]);

  const timezoneOffset = useMemo(
    () => new Date().getTimezoneOffset() / -60,
    [],
  );

  return (
    <div className="flex flex-col h-full relative overflow-hidden ">
      <div className="w-full flex items-center px-2 py-2 shadow-2xl  border-b">
        <div className="w-12 shrink-0 h-full mr-4 flex items-center justify-end">
          <p className="text-xs text-muted-fg">
            GTM{timezoneOffset > 0 ? "+" : "-"}
            {timezoneOffset}
          </p>
        </div>
        <div className="flex items-center w-full">
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            return (
              <p
                key={format(day, "iiiiii")}
                className={cn(
                  "flex-1 w-full rounded-lg p-2",
                  "flex items-center justify-center",
                  "text-xs  uppercase",
                  isSelected
                    ? "text-current bg-overlay-highlight font-semibold"
                    : "text-muted-fg ",
                )}
              >
                {format(day, "iii")} {day.getDate().toString().padStart(2, "0")}
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
            {days.map((day) => {
              const dayKey = getEventOccurrenceDayKey(day);
              const dayOccurrences = groupedEventOccurrences[dayKey];

              return (
                <DayEventsColumn key={day.toISOString()} date={day}>
                  {dayOccurrences?.map((occurrence) =>
                    occurrence.isDraft ? (
                      <DayViewDraftOccurrence
                        key="event-draft-occurrence"
                        occurrence={occurrence}
                      />
                    ) : (
                      <DayViewOccurrence
                        key={`event-occurrence-${occurrence.eventOccurrenceId}`}
                        occurrence={occurrence}
                      />
                    ),
                  )}
                </DayEventsColumn>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
