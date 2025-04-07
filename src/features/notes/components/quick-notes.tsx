"use client";
import { useQuickNotesStore } from "@/features/notes/store/quick-notes-store-provider";
import { HubStackList } from "./hub-stack-list";
import { QuickNotesLoading } from "./loading";
import { QuickNotesSidebar } from "./quick-notes-sidebar";

export const QuickNotes = () => {
  const isHydrated = useQuickNotesStore((state) => state.isHydrated);

  return isHydrated ? (
    <div className="min-h-0 h-full flex  w-full overflow-hidden bg-bg">
      <QuickNotesSidebar />
      <HubStackList />
    </div>
  ) : (
    <QuickNotesLoading />
  );
};
