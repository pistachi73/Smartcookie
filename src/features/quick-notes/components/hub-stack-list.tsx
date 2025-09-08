"use client";

import { useQuickNotesStore } from "../store/quick-notes-store-provider";
import { QuickNotesEmptyState } from "./empty-state";
import { HubNotesStack } from "./hub-notes-stack";

export const HubStackList = () => {
  const visibleHubs = useQuickNotesStore((state) => state.visibleHubs);
  const hasVisibleHubs = !!visibleHubs.length;

  if (!hasVisibleHubs) return <QuickNotesEmptyState />;

  return (
    <div className=" h-full grow relative shrink-0 bg-white p-4 sm:p-6 space-y-6 overflow-y-auto @container">
      {visibleHubs.map((hubId) => (
        <HubNotesStack hubId={hubId} key={hubId} />
      ))}
    </div>
  );
};
