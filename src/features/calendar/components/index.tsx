"use client";

import dynamic from "next/dynamic";
import { useShallow } from "zustand/react/shallow";

import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import { useOptimizedCalendarSessions } from "../hooks/use-optimized-calendar-sessions";
import { CalendarPageHeader } from "./calendar-page-header";
import { CalendarSidebar } from "./calendar-sidebar";
import { CalendarView } from "./calendar-view";

const DynamicAddSessionsFormModal = dynamic(
  () =>
    import("@/features/hub/components/session/add-sessions-form-modal").then(
      (mod) => mod.AddSessionsFormModal,
    ),
  {
    ssr: false,
  },
);

export const Calendar = () => {
  // Initialize the optimized calendar system
  const { up } = useViewport();
  const {
    sidebarOpen,
    calendarView,
    selectedDate,
    isCreateSessionModalOpen,
    defaultSessionFormData,
    setIsCreateSessionModalOpen,
  } = useCalendarStore(
    useShallow((store) => ({
      sidebarOpen: store.sidebarOpen,
      calendarView: store.calendarView,
      selectedDate: store.selectedDate,
      isCreateSessionModalOpen: store.isCreateSessionModalOpen,
      defaultSessionFormData: store.defaultSessionFormData,
      setIsCreateSessionModalOpen: store.setIsCreateSessionModalOpen,
    })),
  );

  useOptimizedCalendarSessions({
    viewType: calendarView,
    date: selectedDate,
  });

  const showSidebarViewport = up("lg");

  return (
    <>
      <div className="min-h-0 h-full flex flex-col bg-bg">
        <CalendarPageHeader />
        <div className="h-full min-h-0 flex-1 flex bg-overlay">
          <CalendarView />
          {sidebarOpen && showSidebarViewport && <CalendarSidebar />}
        </div>
      </div>
      <DynamicAddSessionsFormModal
        isOpen={isCreateSessionModalOpen}
        onOpenChange={setIsCreateSessionModalOpen}
        defaultValues={defaultSessionFormData ?? undefined}
      />
    </>
  );
};
