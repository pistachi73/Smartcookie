"use client";

import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
import { CalendarSidebar } from "./calendar-sidebar";
import { CalendarSkeleton } from "./calendar-skeleton";
import { CalendarView } from "./calendar-view";

import { buttonStyles } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/classes";
import { Heading } from "@/ui/heading";
import { FolderLibraryIcon } from "@hugeicons-pro/core-solid-rounded";
import { PlusSignIcon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-aria-components";

export const Calendar = () => {
  const _isHydrated = useCalendarStore((state) => state._isHydrated);
  const sidebarOpen = useCalendarStore((store) => store.sidebarOpen);

  if (!_isHydrated) {
    return <CalendarSkeleton />;
  }

  return (
    <>
      <div className="min-h-0 h-full flex flex-col bg-bg">
        <div className="p-5 border-b flex flex-col @2xl:flex-row justify-between gap-4 items-start @2xl:items-center">
          <div className="flex items-center gap-x-4">
            <div className="size-12 rounded-lg bg-overlay shadow-md flex items-center justify-center">
              <HugeiconsIcon
                icon={FolderLibraryIcon}
                size={20}
                className="text-primary"
              />
            </div>
            <div className="flex flex-col">
              <Heading level={1}>Calendar</Heading>
              <span className="text-muted-fg text-sm">
                Manage your calendar
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center justify-end w-full @2xl:w-auto">
            <Link
              className={cn(
                buttonStyles({
                  intent: "primary",
                  size: "small",
                  shape: "square",
                }),
                "px-0 size-10 @2xl:h-10 @2xl:w-auto @2xl:px-4",
              )}
              href="/portal/hubs/new"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
              <span className="hidden @2xl:block">Add session</span>
            </Link>
          </div>
        </div>
        <div className="h-full min-h-0 flex-1 flex bg-overlay">
          {sidebarOpen && <CalendarSidebar />}
          <CalendarView />
        </div>
      </div>
    </>
  );
};
