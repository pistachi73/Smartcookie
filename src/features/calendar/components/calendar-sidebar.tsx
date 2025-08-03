"use client";

import { CalendarDate } from "@internationalized/date";
import { useEffect, useState } from "react";
import { Temporal } from "temporal-polyfill";

import { Calendar } from "@/ui/calendar";
import { ResizablePanelRoot } from "@/ui/resizable-panel";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import { SessionsForDate } from "./sessions-for-date";

export const CalendarSidebar = () => {
  const selectedDate = useCalendarStore((store) => store.selectedDate);
  const selectDate = useCalendarStore((store) => store.selectDate);

  const [calendarValue, setCalendarValue] = useState<CalendarDate | undefined>(
    selectedDate
      ? new CalendarDate(
          selectedDate.year,
          selectedDate.month,
          selectedDate.day,
        )
      : undefined,
  );
  const [focusedDate, setFocusedDate] = useState<CalendarDate | undefined>(
    calendarValue,
  );

  useEffect(() => {
    if (!selectedDate) return;
    setCalendarValue(
      new CalendarDate(selectedDate.year, selectedDate.month, selectedDate.day),
    );
    setFocusedDate(
      new CalendarDate(selectedDate.year, selectedDate.month, selectedDate.day),
    );
  }, [selectedDate]);

  return (
    <div className="min-h-0 shrink-0 relative overflow-y-auto border-l w-80">
      <div className="flex flex-col relative w-full">
        <div className="sticky bottom-0 left-0 h-full w-full p-4 border-b">
          <ResizablePanelRoot value="calendar">
            <Calendar
              value={calendarValue}
              onChange={(date) => {
                setCalendarValue(date);
                selectDate(Temporal.PlainDate.from(date.toString()));
              }}
              focusedValue={focusedDate}
              onFocusChange={setFocusedDate}
              spacing="medium"
            />
          </ResizablePanelRoot>
        </div>
        <div className="p-4 border-b w-full">
          <SessionsForDate />
        </div>
        {/* <div className="p-4 w-full">
          <UpcomingSessions />
        </div> */}
      </div>
    </div>
  );
};
