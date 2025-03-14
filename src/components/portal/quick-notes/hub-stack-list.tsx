"use client";

import { useQuickNotesStore } from "@/providers/quick-notes-store-provider";
import { AnimatePresence, motion } from "motion/react";
import { EmptyState } from "./empty-state";
import { HubNotesStack } from "./hub-notes-stack";
export const HubStackList = () => {
  const visibleHubs = useQuickNotesStore((state) => state.visibleHubs);
  const hasVisibleHubs = !!visibleHubs.size;

  if (!hasVisibleHubs) return <EmptyState />;

  return (
    <div className="w-full h-full flex overflow-scroll relative">
      <AnimatePresence mode="popLayout">
        {Array.from(visibleHubs).map((hubId) => (
          <motion.div
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
            className="h-full will-change-transform"
          >
            <HubNotesStack hubId={hubId} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
