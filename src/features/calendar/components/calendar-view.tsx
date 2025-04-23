"use client";

import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";
import { memo } from "react";
import { CalendarHeader } from "./calendar-header";
import { AgendaView } from "./views/agenda-view/agenda-view";
import { DayView } from "./views/day-view/day-view";
import { MonthView } from "./views/month-view/month-view";

const calendarAnimation = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: regularSpring,
};

export const CalendarView = memo(() => {
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
        <CalendarHeader />
        {calendarView === "day" && <DayView key="day-view" />}
        {calendarView === "weekday" && <DayView key="weekday-view" />}
        {calendarView === "week" && <DayView key="week-view" />}
        {calendarView === "month" && <MonthView key="month-view" />}
        {calendarView === "agenda" && <AgendaView key="agenda-view" />}
      </div>
    </div>
  );
});
