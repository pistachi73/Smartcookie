import { useShallow } from "zustand/react/shallow";

import { useOptimizedCalendarSessions } from "../hooks/use-optimized-calendar-sessions";
import { useCalendarStore } from "../providers/calendar-store-provider";
import { CalendarSidebar } from "./calendar-sidebar";
import { CalendarView } from "./calendar-view";

export const MainCalendar = () => {
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

  return (
    <div className="h-full min-h-0 flex-1 flex bg-overlay">
      <CalendarView />
      {sidebarOpen && <CalendarSidebar />}
    </div>
  );
};
