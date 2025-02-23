"use client";
import { Loader } from "@/components/ui/new/ui";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import dynamic from "next/dynamic";
import { useShallow } from "zustand/react/shallow";
import { CalendarView } from "./calendar-view";
import { CalendarSidebar } from "./components/calendar-sidebar";

const LazyEventOccurrenceFormSheet = dynamic(() =>
  import("./occurrence-form-sheet").then((mod) => mod.EventOccurrenceFormSheet),
);
export const Calendar = () => {
  const _isHydrated = useCalendarStore(
    useShallow((store) => store._isHydrated),
  );

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
};
