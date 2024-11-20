"use client";

import { regularSpring } from "@/utils/animation";
import { AnimatePresence, m } from "framer-motion";
import {
  CalendarContextProvider,
  useCalendarContext,
} from "./calendar-context";
import { CalendarHeader } from "./calendar-header";
import { CalendarSidebar } from "./calendar-sidebar";
import { DayCalendar } from "./day-calendar";
import { MonthCalendar } from "./month-calendar";
import { WeekCalendar } from "./week-calendar";

export const Calendar = () => {
  return (
    <CalendarContextProvider>
      <div className="w-full grow flex flex-col gap-12 pb-4">
        <CalendarContent />
      </div>
    </CalendarContextProvider>
  );
};

const CalendarContent = () => {
  const { isSidebarOpen, calendarType } = useCalendarContext();

  const calendarAnimation = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: regularSpring,
  };

  return (
    <div className="bg-card-background rounded-3xl flex flex-row grow max-h-[calc(100vh-112px)] overflow-hidden">
      {isSidebarOpen && <CalendarSidebar />}
      <div className="grow overflow-hidden flex flex-col">
        <CalendarHeader />
        <div className="overflow-hidden flex flex-col grow">
          <AnimatePresence mode="wait">
            {calendarType === "day" && (
              <m.div
                {...calendarAnimation}
                key="day-calendar"
                className="overflow-hidden h-full w-full"
              >
                <DayCalendar />
              </m.div>
            )}

            {calendarType === "week" && (
              <m.div
                {...calendarAnimation}
                key="week-calendar"
                className="overflow-hidden h-full w-full"
              >
                <WeekCalendar />
              </m.div>
            )}
            {calendarType === "month" && (
              <m.div
                {...calendarAnimation}
                key="month-calendar"
                className="overflow-hidden h-full w-full"
              >
                <MonthCalendar />
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
