"use client";

import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { regularSpring } from "@/utils/animation";
import { AnimatePresence, motion } from "motion/react";
import { useShallow } from "zustand/react/shallow";
import { CalendarHeader } from "./calendar-header";
import { AgendaView } from "./views/agenda-view";
import { DayView } from "./views/day-view";
import { MonthView } from "./views/month-view/month-view";
import { WeekView } from "./views/week-view";

const useCalendar = () =>
  useCalendarStore(useShallow(({ calendarView }) => ({ calendarView })));

export const CalendarView = () => {
  const { calendarView } = useCalendar();

  const calendarAnimation = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: regularSpring,
  };

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
        <div className="overflow-hidden flex flex-col grow">
          <AnimatePresence mode="wait">
            {calendarView === "day" && (
              <motion.div
                {...calendarAnimation}
                key="day-view"
                className="overflow-hidden h-full w-full"
              >
                <DayView />
              </motion.div>
            )}

            {calendarView === "week" && (
              <motion.div
                {...calendarAnimation}
                key="week-view"
                className="overflow-hidden h-full w-full"
              >
                <WeekView />
              </motion.div>
            )}
            {calendarView === "month" && (
              <motion.div
                {...calendarAnimation}
                key="month-view"
                className="overflow-hidden h-full w-full"
              >
                <MonthView />
              </motion.div>
            )}
            {calendarView === "agenda" && (
              <motion.div
                {...calendarAnimation}
                key="month-view"
                className="overflow-hidden h-full w-full"
              >
                <AgendaView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
