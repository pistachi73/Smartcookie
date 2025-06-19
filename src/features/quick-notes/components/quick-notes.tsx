"use client";
import { useQuickNotesStore } from "@/features/quick-notes/store/quick-notes-store-provider";
import { PageHeader } from "@/shared/components/layout/page-header";
import { NoteIcon } from "@hugeicons-pro/core-solid-rounded";
import { Suspense } from "react";
import { HubStackList } from "./hub-stack-list";
import { QuickNotesLoading } from "./loading";
import { QuickNotesSidebar } from "./quick-notes-sidebar";

export const QuickNotes = () => {
  const isHydrated = useQuickNotesStore((state) => state.isHydrated);

  return isHydrated ? (
    <Suspense fallback={<QuickNotesLoading />}>
      <div className="min-h-0 h-full flex flex-col w-full overflow-hidden">
        <PageHeader
          title="Quick Notes"
          subTitle="Quickly jot down notes"
          icon={NoteIcon}
          className={{
            container: "bg-bg",
          }}
        />
        <div className="flex flex-1">
          <QuickNotesSidebar />
          <HubStackList />
        </div>
      </div>
    </Suspense>
  ) : (
    <QuickNotesLoading />
  );
};
