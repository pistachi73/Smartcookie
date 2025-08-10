"use client";

import { CalendarDate } from "@internationalized/date";
import { useEffect, useState } from "react";
import { Temporal } from "temporal-polyfill";

import { Calendar } from "@/ui/calendar";
import { ResizablePanelRoot } from "@/ui/resizable-panel";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import { UpcomingSessions } from "./upcoming-sessions";

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
    <div className="min-h-0 shrink-0 relative border-l h-full flex flex-col w-[312px]">
      <div className="sticky left-0 w-full p-4 border-b">
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
            showSelectors={false}
          />
        </ResizablePanelRoot>
      </div>
      {/* <div className="p-4 border-b w-full">
          <SessionsForDate />
        </div> */}
      <div className="p-4 w-full overflow-y-auto h-full bg-white">
        <UpcomingSessions />
      </div>
    </div>
  );
};
