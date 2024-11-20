"use client";

import React, { useState } from "react";

export type CalendarType = "day" | "week" | "month";

const CalendarContext = React.createContext<{
  isSidebarOpen: boolean;
  selectedDate: Date;
  calendarType: CalendarType;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  setCalendarType: React.Dispatch<React.SetStateAction<CalendarType>>;
}>({
  selectedDate: new Date(),
  calendarType: "week",
  isSidebarOpen: true,
  setIsSidebarOpen: () => {},
  setSelectedDate: () => {},
  setCalendarType: () => {},
});

export const CalendarContextProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [calendarType, setCalendarType] = useState<"day" | "week" | "month">(
    "day",
  );

  return (
    <CalendarContext.Provider
      value={{
        isSidebarOpen,
        selectedDate,
        calendarType,
        setIsSidebarOpen,
        setSelectedDate,
        setCalendarType,
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
