"use client";

import type { Hub } from "@/db/schema";
import type { DayGroupedSessionOccurrences } from "@/lib/group-overlapping-occurrences";
import React, { useState } from "react";

export type CalendarType = "day" | "week" | "month";

const CalendarContext = React.createContext<{
  isSidebarOpen: boolean;
  selectedDate: Date;
  calendarView: CalendarType;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  setCalendarView: React.Dispatch<React.SetStateAction<CalendarType>>;
  hubs?: Hub[];
  hubsMap?: Record<number, Hub>;
  sessionOccurrences?: DayGroupedSessionOccurrences;
}>({
  selectedDate: new Date(),
  calendarView: "month",
  isSidebarOpen: true,
  setIsSidebarOpen: () => {},
  setSelectedDate: () => {},
  setCalendarView: () => {},
  hubs: [],
  hubsMap: {},
  sessionOccurrences: {},
});

export const CalendarContextProvider = ({
  hubs,
  sessionOccurrences,
  children,
}: {
  hubs?: Hub[];
  sessionOccurrences?: DayGroupedSessionOccurrences;
  children: React.ReactNode;
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">(
    "month",
  );

  const hubsMap = hubs?.reduce<Record<string, Hub>>((acc, hub) => {
    acc[hub.id] = hub;
    return acc;
  }, {});

  return (
    <CalendarContext.Provider
      value={{
        isSidebarOpen,
        selectedDate,
        calendarView,
        setIsSidebarOpen,
        setSelectedDate,
        setCalendarView,
        hubs,
        hubsMap,
        sessionOccurrences,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  const context = React.useContext(CalendarContext);

  if (context === undefined) {
    throw new Error(
      "UseCalendarContext must be used within a CalendarContextProvider",
    );
  }

  return { ...context };
};
