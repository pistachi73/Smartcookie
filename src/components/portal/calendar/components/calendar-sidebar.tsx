"use client";

import { ResizablePanelRoot } from "@/components/ui/resizable-panel";

import { Calendar } from "@/components/ui/new/ui";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { CalendarDate } from "@internationalized/date";
import { Temporal } from "@js-temporal/polyfill";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { UpcomingEvents } from "./upcoming-events";

const useCalendarSidebar = () =>
  useCalendarStore(
    useShallow((store) => ({
      hubs: store.hubs,
      selectedDate: store.selectedDate,
      selectDate: store.selectDate,
    })),
  );

export const CalendarSidebar = () => {
  const { selectDate, selectedDate } = useCalendarSidebar();

  const calendarValue = selectedDate
    ? new CalendarDate(selectedDate.year, selectedDate.month, selectedDate.day)
    : undefined;

  const [focusedDate, setFocusedDate] = useState<CalendarDate | undefined>(
    calendarValue,
  );

  useEffect(() => {
    if (!selectedDate) return;
    setFocusedDate(
      new CalendarDate(selectedDate.year, selectedDate.month, selectedDate.day),
    );
  }, [selectedDate]);

  return (
    <div className="h-full max-h-[calc(100dvh-16px)]  shrink-0  relative transition-[width] duration-500 bg-overlay p-3 rounded-lg overflow-y-auto">
      <div className="flex flex-col  gap-4 relative">
        <UpcomingEvents />

        <div className="sticky bottom-0 left-0 h-full w-full">
          <ResizablePanelRoot value="calendar">
            <div className="p-2 bg-overlay-elevated rounded-lg sticky top-0 left-0 h-full w-full">
              <Calendar
                value={calendarValue}
                onChange={(date) => {
                  console.log("date", date);
                  selectDate(Temporal.PlainDate.from(date.toString()));
                }}
                focusedValue={focusedDate}
                onFocusChange={setFocusedDate}
              />
            </div>
          </ResizablePanelRoot>
        </div>
      </div>
    </div>
  );
};
