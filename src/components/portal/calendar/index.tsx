"use client";
import { Loader } from "@/components/ui/loader";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { CalendarView } from "./calendar-view";
import { CalendarSidebar } from "./components/calendar-sidebar";
import { EventOccurrenceFormSheet } from "./occurrence-form-sheet";

export const Calendar = () => {
  const _isHydrated = useCalendarStore((store) => store._isHydrated);

  console.log("_isHydrated", _isHydrated);

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
      <EventOccurrenceFormSheet />
    </>
  );
};
