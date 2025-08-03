"use client";

import dynamic from "next/dynamic";

import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import { useOptimizedCalendarSessions } from "../hooks/use-optimized-calendar-sessions";
import { CalendarPageHeader } from "./calendar-page-header";
import { CalendarSidebar } from "./calendar-sidebar";
import { CalendarSkeleton } from "./calendar-skeleton";
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
  useOptimizedCalendarSessions();
  const { up } = useViewport();
  const _isHydrated = useCalendarStore((state) => state._isHydrated);
  const sidebarOpen = useCalendarStore((store) => store.sidebarOpen);
  const setIsCreateSessionModalOpen = useCalendarStore(
    (store) => store.setIsCreateSessionModalOpen,
  );
  const isCreateSessionModalOpen = useCalendarStore(
    (store) => store.isCreateSessionModalOpen,
  );
  const defaultSessionFormData = useCalendarStore(
    (store) => store.defaultSessionFormData,
  );

  if (!_isHydrated) {
    return <CalendarSkeleton />;
  }

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
