"use client";

import { Calendar03Icon } from "@hugeicons-pro/core-solid-rounded";
import { useShallow } from "zustand/react/shallow";

import { PageHeader } from "@/shared/components/layout/page-header";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";

import { useCalendarHeaderTitle } from "@/features/calendar/hooks/use-calendar-header-title";
import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import { AddSessionButton } from "./add-session-button";
import { NavigationButtons } from "./navigation-buttons";
import { SidebarToggle } from "./sidebar-toggle";
import { TodayButton } from "./today-button";
import { ViewSelector } from "./view-selector";

export const CalendarPageHeader = () => {
  const { selectedDate, calendarView, setIsCreateSessionModalOpen } =
    useCalendarStore(
      useShallow((store) => ({
        selectedDate: store.selectedDate,
        calendarView: store.calendarView,
        setIsCreateSessionModalOpen: store.setIsCreateSessionModalOpen,
      })),
    );

  const { down } = useViewport();
  const { title } = useCalendarHeaderTitle({
    selectedDate,
    calendarView: calendarView === "weekday" ? "week" : calendarView,
  });

  const isMobile = down("sm");

  const actions = isMobile ? (
    // Mobile order: Navigation Buttons, View Selector, Today, Sidebar Toggle, Add Session
    <>
      <NavigationButtons />
      <ViewSelector />
      <TodayButton />
      <AddSessionButton onPress={() => setIsCreateSessionModalOpen(true)} />
    </>
  ) : (
    // Desktop order: Navigation Buttons, View Selector, Today, Sidebar Toggle, Add Session
    <>
      <NavigationButtons />
      <ViewSelector />
      <TodayButton />
      <SidebarToggle />
      <AddSessionButton onPress={() => setIsCreateSessionModalOpen(true)} />
    </>
  );

  return (
    <PageHeader
      title={title}
      icon={Calendar03Icon}
      actions={actions}
      className={{
        container: "flex-row justify-between items-center",
        actionsContainer: "w-auto",
      }}
    />
  );
};
