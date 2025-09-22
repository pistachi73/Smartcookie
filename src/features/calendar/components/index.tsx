"use client";

import dynamic from "next/dynamic";
import { useShallow } from "zustand/react/shallow";

import { ProgressCircle } from "@/shared/components/ui/progress-circle";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import { CalendarPageHeader } from "./calendar-page-header";

const DynamicAddSessionsFormModal = dynamic(
  () =>
    import("@/features/hub/components/session/add-sessions-form-modal").then(
      (mod) => mod.AddSessionsFormModal,
    ),
  {
    ssr: false,
  },
);

const MainCalendar = dynamic(
  () => import("./main").then((mod) => mod.MainCalendar),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex-col gap-4  bg-white flex items-center justify-center">
        <ProgressCircle
          isIndeterminate
          className="size-10 sm:size-12 text-primary"
          strokeWidth={2.5}
        />
        <p className="block text-sm font-medium text-muted-fg">
          Loading calendar...
        </p>
      </div>
    ),
  },
);

export const Calendar = () => {
  const {
    isCreateSessionModalOpen,
    defaultSessionFormData,
    setIsCreateSessionModalOpen,
  } = useCalendarStore(
    useShallow((store) => ({
      isCreateSessionModalOpen: store.isCreateSessionModalOpen,
      defaultSessionFormData: store.defaultSessionFormData,
      setIsCreateSessionModalOpen: store.setIsCreateSessionModalOpen,
    })),
  );

  return (
    <>
      <div className="min-h-0 h-full flex flex-col bg-bg">
        <CalendarPageHeader />
        <MainCalendar />
      </div>
      <DynamicAddSessionsFormModal
        isOpen={isCreateSessionModalOpen}
        onOpenChange={setIsCreateSessionModalOpen}
        defaultValues={defaultSessionFormData ?? undefined}
      />
    </>
  );
};
