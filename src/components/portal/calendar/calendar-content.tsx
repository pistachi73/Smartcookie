"use client";

import { regularSpring } from "@/utils/animation";
import { AnimatePresence, motion } from "motion/react";
import { useCalendarContext } from "./calendar-context";
import { CalendarHeader } from "./calendar-header";
import { DayCalendar } from "./day-calendar";
import { MonthCalendar } from "./month-calendar";
import { WeekCalendar } from "./week-calendar";

export const CalendarContent = () => {
  const { isSidebarOpen, calendarType } = useCalendarContext();

  const calendarAnimation = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: regularSpring,
  };

  return (
    <div className="h-full grow flex flex-row overflow-hidden ">
      <div className="grow overflow-hidden flex flex-col">
        <CalendarHeader />
        <div className="overflow-hidden flex flex-col grow">
          <AnimatePresence mode="wait">
            {calendarType === "day" && (
              <motion.div
                {...calendarAnimation}
                key="day-calendar"
                className="overflow-hidden h-full w-full"
              >
                <DayCalendar />
              </motion.div>
            )}

            {calendarType === "week" && (
              <motion.div
                {...calendarAnimation}
                key="week-calendar"
                className="overflow-hidden h-full w-full"
              >
                <WeekCalendar />
              </motion.div>
            )}
            {calendarType === "month" && (
              <motion.div
                {...calendarAnimation}
                key="month-calendar"
                className="overflow-hidden h-full w-full"
              >
                <MonthCalendar />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
