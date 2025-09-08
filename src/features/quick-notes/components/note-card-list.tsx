import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, m } from "motion/react";

import { EmptyState } from "@/shared/components/ui/empty-state";

import type { CustomColor } from "@/db/schema/shared";
import { quickNotesByHubIdQueryOptions } from "../lib/quick-notes-query-options";
import { NoteCard } from "./note-card";
import { SkeletonNoteCard } from "./note-card/skeleton-note-card";

// Animation variants for consistent animations
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      mass: 0.75,
      delay: index * 0.04, // Subtle staggered effect
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

interface NoteCardListProps {
  hubId: number;
  hubColor: CustomColor;
}

export const NoteCardList = ({ hubId, hubColor }: NoteCardListProps) => {
  const { data: notes, isLoading } = useQuery(
    quickNotesByHubIdQueryOptions(hubId),
  );
  const hasNotes = !!notes?.length;

  return (
    <div className="w-full @container">
      <AnimatePresence mode="popLayout" initial={false}>
        {isLoading ? (
          <div className="columns-1 @lg:columns-2 @4xl:columns-3  gap-3 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <m.div
                key={`skeleton-${index}`}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="will-change-transform origin-top break-inside-avoid mb-4"
              >
                <SkeletonNoteCard />
              </m.div>
            ))}
          </div>
        ) : hasNotes ? (
          <div className="columns-1 @lg:columns-2 @4xl:columns-3  gap-3">
            {notes?.map((note, index) => (
              <m.div
                layout
                key={note.clientId || note.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="will-change-transform origin-top mb-3 inline-block w-full"
              >
                <NoteCard note={note} hubColor={hubColor} />
              </m.div>
            ))}
          </div>
        ) : (
          <m.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <EmptyState
              title="No notes yet"
              description="Create your first note to get started"
              className="min-h-0 p-4"
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
