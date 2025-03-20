"use client";

import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
import { Loader } from "@/ui/loader";
import dynamic from "next/dynamic";
import { CalendarSidebar } from "./calendar-sidebar";
import { CalendarView } from "./calendar-view";

const LazyEventOccurrenceFormSheet = dynamic(() =>
  import("./occurrence-form-sheet").then((mod) => mod.EventOccurrenceFormSheet),
);

export const Calendar = () => {
  const _isHydrated = useCalendarStore((state) => state._isHydrated);
  const sidebarOpen = useCalendarStore((store) => store.sidebarOpen);

  if (!_isHydrated)
    return (
      <div className="h-full w-full bg-overlay flex items-center justify-center rounded-xl">
        <Loader />
      </div>
    );

  return (
    <>
      <div className="min-h-0 h-full flex bg-overlay">
        {sidebarOpen && <CalendarSidebar />}
        <CalendarView />
      </div>
      <LazyEventOccurrenceFormSheet />
    </>
  );
};
