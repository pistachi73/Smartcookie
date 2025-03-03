"use client";
import { Loader } from "@/components/ui";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import type { CalendarStore } from "@/stores/calendar-store/calendar-store.types";
import dynamic from "next/dynamic";
import { memo, useEffect } from "react";
import { CalendarView } from "./calendar-view";
import { CalendarSidebar } from "./components/calendar-sidebar";
const LazyEventOccurrenceFormSheet = dynamic(() =>
  import("./occurrence-form-sheet").then((mod) => mod.EventOccurrenceFormSheet),
);

// The Calendar component is rendering multiple times likely due to:
// 1. Missing displayName for the memo component
// 2. No explicit selector memoization
// 3. Potential re-renders from parent components
// 4. Zustand store updates triggering re-renders

// Create a stable selector function outside the component
const isHydratedSelector = (state: CalendarStore) => state._isHydrated;

export const Calendar = memo(() => {
  // For debugging - this shows when the component renders
  console.log("Calendar rendered");
  useEffect(() => {});

  // Use the stable selector with proper memoization
  const _isHydrated = useCalendarStore(isHydratedSelector);

  if (!_isHydrated)
    return (
      <div className="h-full w-full bg-overlay flex items-center justify-center rounded-xl">
        <Loader />
        {/* <Loading01Icon size={20} className="animate-spin ml-2" /> */}
      </div>
    );

  return (
    <>
      <div className="h-full flex gap-2 ">
        <CalendarSidebar />
        <div className="w-full h-full rounded-xl overflow-hidden bg-overlay max-h-[calc(100dvh-16px)] shadow-2xl">
          <CalendarView />
        </div>
      </div>
      <LazyEventOccurrenceFormSheet />
    </>
  );
});

// Add displayName to help with debugging
Calendar.displayName = "Calendar";
