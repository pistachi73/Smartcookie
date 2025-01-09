"use client";

import { useCalendarStore } from "@/providers/calendar-store-provider";
import { useShallow } from "zustand/react/shallow";
import { CalendarSidebarEditSession } from "./calendar-sidebar-edit-session";
import { CalendarSidebarMain } from "./calendar-sidebar-main";

const useCalendarSidebar = () =>
  useCalendarStore(
    useShallow((store) => ({
      activeSidebar: store.activeSidebar,
    })),
  );

export const CalendarSidebar = () => {
  const { activeSidebar } = useCalendarSidebar();
  return (
    <div className="h-full w-[300px] rounded-xl shrink-0 bg-base ">
      {activeSidebar === "main" && <CalendarSidebarMain />}
      {activeSidebar === "edit-session" && <CalendarSidebarEditSession />}
    </div>
  );
};
