import { useShallow } from "zustand/react/shallow";

import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";

import { useOptimizedCalendarSessions } from "../hooks/use-optimized-calendar-sessions";
import { useCalendarStore } from "../providers/calendar-store-provider";
import { CalendarSidebar } from "./calendar-sidebar";
import { CalendarView } from "./calendar-view";

export const MainCalendar = () => {
  const { up } = useViewport();
  const { sidebarOpen, calendarView, selectedDate } = useCalendarStore(
    useShallow((store) => ({
      sidebarOpen: store.sidebarOpen,
      calendarView: store.calendarView,
      selectedDate: store.selectedDate,
    })),
  );

  useOptimizedCalendarSessions({
    viewType: calendarView,
    date: selectedDate,
  });

  const showSidebarViewport = up("lg");

  return (
    <div className="h-full min-h-0 flex-1 flex bg-overlay">
      <CalendarView />
      {sidebarOpen && showSidebarViewport && <CalendarSidebar />}
    </div>
  );
};
