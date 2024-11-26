"use client";

import type { Hub } from "@/db/schema";
import type { DayGroupedSessionOccurrences } from "@/lib/group-overlapping-occurrences";
import React, { useState } from "react";

export type CalendarType = "day" | "week" | "month";

const CalendarContext = React.createContext<{
  isSidebarOpen: boolean;
  selectedDate: Date;
  calendarType: CalendarType;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  setCalendarType: React.Dispatch<React.SetStateAction<CalendarType>>;
  hubs?: Hub[];
  hubsMap?: Record<string, Hub>;
  sessionOccurrences?: DayGroupedSessionOccurrences;
}>({
  selectedDate: new Date(),
  calendarType: "month",
  isSidebarOpen: true,
  setIsSidebarOpen: () => {},
  setSelectedDate: () => {},
  setCalendarType: () => {},
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
  const [calendarType, setCalendarType] = useState<"day" | "week" | "month">(
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
        calendarType,
        setIsSidebarOpen,
        setSelectedDate,
        setCalendarType,
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
