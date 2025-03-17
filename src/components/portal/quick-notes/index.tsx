"use client";
import { StoreLoading } from "@/components/ui/store-loading";
import { useQuickNotesStore } from "@/providers/quick-notes-store-provider";
import { HubStackList } from "./hub-stack-list";
import { QuickNotesLoading } from "./loading";
import QuickNotesNav from "./quick-notes-nav";
import { QuickNotesSidebar } from "./quick-notes-sidebar/index";

export const QuickNotes = () => {
  const isHydrated = useQuickNotesStore((state) => state.isHydrated);

  return (
    <div className="h-full w-full flex relative flex-col overflow-hidden">
      <QuickNotesNav />
      <StoreLoading isHydrated={isHydrated} fallback={<QuickNotesLoading />}>
        <div className="min-h-0 h-full flex bg-overlay w-full overflow-hidden">
          <QuickNotesSidebar />
          <HubStackList />
        </div>
      </StoreLoading>
    </div>
  );
};
