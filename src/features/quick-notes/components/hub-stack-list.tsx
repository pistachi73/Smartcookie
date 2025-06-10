"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useQuickNotesStore } from "../store/quick-notes-store-provider";
import { EmptyState } from "./empty-state";
import { HubNotesStack } from "./hub-notes-stack";

export const HubStackList = () => {
  const visibleHubs = useQuickNotesStore((state) => state.visibleHubs);
  const hasVisibleHubs = !!visibleHubs.size;

  if (!hasVisibleHubs) return <EmptyState />;

  return (
    <div className="w-full h-full min-h-0 flex flex-1 overflow-auto relative pb-12 shrink-0 bg-overlay">
      <AnimatePresence mode="popLayout" initial={false}>
        {Array.from(visibleHubs).map((hubId) => (
          <m.div
            layout="position"
            key={hubId}
            initial={{ opacity: 0, x: 5, scale: 0.99 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -5, scale: 0.99 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 0.5,
            }}
            className="h-full will-change-transform pb-20"
          >
            <HubNotesStack hubId={hubId} />
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
