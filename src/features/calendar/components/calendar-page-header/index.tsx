"use client";

import { Calendar03Icon } from "@hugeicons-pro/core-solid-rounded";
import dynamic from "next/dynamic";
import { useShallow } from "zustand/react/shallow";

import { PageHeader } from "@/shared/components/layout/page-header";

import { useCalendarHeaderTitle } from "@/features/calendar/hooks/use-calendar-header-title";
import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import { AddSessionButton } from "./add-session-button";
import { NavigationButtons } from "./navigation-buttons";
import { SidebarToggle } from "./sidebar-toggle";
import { TodayButton } from "./today-button";
import { ViewSelectorTrigger } from "./view-selector/view-selector-trigger";

const ViewSelector = dynamic(
  () => import("./view-selector").then((mod) => mod.ViewSelector),
  {
    ssr: false,
    loading: () => <ViewSelectorTrigger />,
  },
);

export const CalendarPageHeader = () => {
  const { selectedDate, calendarView, setIsCreateSessionModalOpen } =
    useCalendarStore(
      useShallow((store) => ({
        selectedDate: store.selectedDate,
        calendarView: store.calendarView,
        setIsCreateSessionModalOpen: store.setIsCreateSessionModalOpen,
      })),
    );

  const { title } = useCalendarHeaderTitle({
    selectedDate,
    calendarView: calendarView === "weekday" ? "week" : calendarView,
  });

  return (
    <PageHeader
      title={title}
      icon={Calendar03Icon}
      actions={
        <>
          <NavigationButtons />
          <ViewSelector />
          <TodayButton />
          <SidebarToggle />
          <AddSessionButton onPress={() => setIsCreateSessionModalOpen(true)} />
        </>
      }
      className={{
        icon: "hidden sm:flex",
        container: "flex-row justify-between items-center py-3 sm:py-5",
        actionsContainer: "w-auto",
      }}
    />
  );
};
