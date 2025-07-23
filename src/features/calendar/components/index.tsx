"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { FolderLibraryIcon } from "@hugeicons-pro/core-solid-rounded";
import { PlusSignIcon } from "@hugeicons-pro/core-stroke-rounded";
import dynamic from "next/dynamic";

import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/ui/heading";

import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
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
  const _isHydrated = useCalendarStore((state) => state._isHydrated);
  const selectedDate = useCalendarStore((store) => store.selectedDate);
  const sidebarOpen = useCalendarStore((store) => store.sidebarOpen);
  const setIsCreateSessionModalOpen = useCalendarStore(
    (store) => store.setIsCreateSessionModalOpen,
  );
  const isCreateSessionModalOpen = useCalendarStore(
    (store) => store.isCreateSessionModalOpen,
  );
  const createSessionFormData = useCalendarStore(
    (store) => store.createSessionFormData,
  );

  // Only show skeleton while hydrating, let individual views handle session loading
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
            <Button
              intent="primary"
              size="small"
              shape="square"
              className="px-0 size-10 @2xl:h-10 @2xl:w-auto @2xl:px-4"
              onPress={() => {
                setIsCreateSessionModalOpen(true);
              }}
            >
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
              <span className="hidden @2xl:block">Add session</span>
            </Button>
          </div>
        </div>
        <div className="h-full min-h-0 flex-1 flex bg-overlay">
          <CalendarView />
          {sidebarOpen && <CalendarSidebar />}
        </div>
      </div>
      <DynamicAddSessionsFormModal
        isOpen={isCreateSessionModalOpen}
        onOpenChange={setIsCreateSessionModalOpen}
        defaultValues={createSessionFormData ?? undefined}
      />
    </>
  );
};
