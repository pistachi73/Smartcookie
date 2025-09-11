"use client";

import { cn } from "@/shared/lib/classes";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import { AgendaView } from "./views/agenda-view/agenda-view";
import { DayView } from "./views/day-view/day-view";
import { MonthView } from "./views/month-view/month-view";

export const CalendarView = () => {
  const calendarView = useCalendarStore((state) => state.calendarView);

  return (
    <div
      className={cn(
        "h-full grow flex flex-row overflow-hidden",
        "[--row-height:72px]",
        "[--left-spacing:calc(var(--spacing)*4)]",
      )}
    >
      <div className="grow overflow-hidden flex flex-col">
        {calendarView === "day" && <DayView key="day-view" />}
        {calendarView === "weekday" && <DayView key="weekday-view" />}
        {calendarView === "week" && <DayView key="week-view" />}
        {calendarView === "month" && <MonthView key="month-view" />}
        {calendarView === "agenda" && <AgendaView key="agenda-view" />}
      </div>
    </div>
  );
};
