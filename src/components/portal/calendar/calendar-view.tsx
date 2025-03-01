"use client";

import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import type { CalendarStore } from "@/stores/calendar-store/calendar-store.types";
import { regularSpring } from "@/utils/animation";
import { AnimatePresence, motion } from "motion/react";
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

// Create a stable selector function outside the component
const calendarViewSelector = (state: CalendarStore) => state.calendarView;

export const CalendarView = memo(() => {
  const calendarView = useCalendarStore(calendarViewSelector);

  return (
    <div
      className={cn(
        "h-full grow flex flex-row overflow-hidden",
        "[--row-height:48px]",
        "[--left-spacing:calc(var(--spacing)*4)]",
      )}
    >
      <div className="grow overflow-hidden flex flex-col">
        <CalendarHeader />
        <AnimatePresence mode="wait">
          <motion.div
            {...calendarAnimation}
            key={`${calendarView}-view`}
            className="overflow-hidden h-full w-full grow bg-overlay rounded-lg"
          >
            {calendarView === "day" && <DayView key="day-view" />}
            {calendarView === "weekday" && <DayView key="weekday-view" />}
            {calendarView === "week" && <DayView key="week-view" />}
            {calendarView === "month" && <MonthView key="month-view" />}
            {calendarView === "agenda" && <AgendaView key="agenda-view" />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});
