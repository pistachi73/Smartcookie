"use client";

import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";
import { memo } from "react";
import type { CalendarStore } from "../types/calendar-store.types";

const calendarAnimation = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: regularSpring,
};

// Create a stable selector function outside the component
const calendarViewSelector = (state: CalendarStore) => state.calendarView;

export const CalendarView = memo(() => {
  const calendarView = useCalendarStore(calendarViewSelector);

  return (
    <div
      className={cn(
        "",
        "h-full grow flex flex-row overflow-hidden",
        "[--row-height:48px]",
        "[--left-spacing:calc(var(--spacing)*4)]",
      )}
    >
      <div className="grow overflow-hidden flex flex-col">
        {/* <CalendarHeader /> */}
        {/* <AnimatePresence mode="wait">
          <motion.div
            {...calendarAnimation}
            key={`${calendarView}-view`}
            className="overflow-hidden h-full w-full grow"
          > */}
        {/* {calendarView === "day" && <DayView key="day-view" />} */}
        {/* {calendarView === "weekday" && <DayView key="weekday-view" />}
            {calendarView === "week" && <DayView key="week-view" />}
            {calendarView === "month" && <MonthView key="month-view" />}
            {calendarView === "agenda" && <AgendaView key="agenda-view" />} */}
        {/* </motion.div>
        </AnimatePresence> */}
      </div>
    </div>
  );
});
