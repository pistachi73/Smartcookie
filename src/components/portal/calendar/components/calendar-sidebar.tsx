"use client";

import { ResizablePanelRoot } from "@/components/ui/resizable-panel";

import { Calendar } from "@/components/ui";
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
    }))
  );

export const CalendarSidebar = () => {
  const { selectDate, selectedDate } = useCalendarSidebar();

  const [calendarValue, setCalendarValue] = useState<CalendarDate | undefined>(
    selectedDate
      ? new CalendarDate(selectedDate.year, selectedDate.month, selectedDate.day)
      : undefined
  );
  const [focusedDate, setFocusedDate] = useState<CalendarDate | undefined>(calendarValue);

  useEffect(() => {
    if (!selectedDate) return;
    setFocusedDate(new CalendarDate(selectedDate.year, selectedDate.month, selectedDate.day));
  }, [selectedDate]);

  return (
    <div className='min-h-0  shrink-0  relative overflow-y-auto border-r'>
      <div className='flex flex-col relative'>
        <div className='border-b p-4'>
          <UpcomingEvents />
        </div>

        <div className='sticky bottom-0 left-0 h-full w-full p-4 border-b'>
          <ResizablePanelRoot value='calendar'>
            <Calendar
              value={calendarValue}
              onChange={(date) => {
                setCalendarValue(date);
                selectDate(Temporal.PlainDate.from(date.toString()));
              }}
              focusedValue={focusedDate}
              onFocusChange={setFocusedDate}
            />
          </ResizablePanelRoot>
        </div>
      </div>
    </div>
  );
};
