"use client";

import { cn } from "@/shared/lib/classes";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import { AgendaView } from "./views/agenda-view/agenda-view";
import { DayView } from "./views/day-view/day-view";
import { MonthView } from "./views/month-view/month-view";

export const CalendarView = () => {
  const calendarView = useCalendarStore((state) => state.calendarView);

  const getCalendarView = () => {
    switch (calendarView) {
      case "day":
      case "weekday":
      case "week":
        return <DayView />;
      case "month":
        return <MonthView />;
      case "agenda":
        return <AgendaView />;
    }
  };

  return (
    <div
      className={cn(
        "h-full grow flex flex-row overflow-hidden",
        "[--row-height:72px]",
        "[--left-spacing:calc(var(--spacing)*4)]",
      )}
    >
      <div className="grow overflow-hidden flex flex-col">
        {getCalendarView()}
      </div>
    </div>
  );
};
