import type { CustomColor } from "@/db/schema/shared";
import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";
import { NoteIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useHubNotes } from "./../hooks/use-hub-notes";
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
  const { data: notes, isLoading } = useHubNotes(hubId);
  const hasNotes = !!notes?.length;

  const colorClasses = getCustomColorClasses(hubColor);
  return (
    <div className="h-full flex flex-col gap-3 relative">
      <AnimatePresence mode="popLayout" initial={false}>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <m.div
              key={`skeleton-${index}`}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="will-change-transform origin-top"
            >
              <SkeletonNoteCard />
            </m.div>
          ))
        ) : hasNotes ? (
          notes?.map((note, index) => (
            <m.div
              layout
              // layoutId={String(note.clientId || note.id)}
              key={note.clientId || note.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="will-change-transform origin-top "
            >
              <NoteCard note={note} hubColor={hubColor} />
            </m.div>
          ))
        ) : (
          <m.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className=" bg-overlay border  shadow-sm dark:bg-overlay-highlight rounded-lg h-auto flex flex-col items-center py-8 px-4 text-center"
          >
            <div
              className={cn(
                "w-12 h-12 mb-3 rounded-full flex items-center justify-center",
                colorClasses.bg,
                "bg-opacity-20 dark:bg-opacity-30",
              )}
            >
              <HugeiconsIcon
                icon={NoteIcon}
                size={24}
                className={colorClasses.text}
              />
            </div>
            <p className="font-medium mb-1">No notes in this hub</p>
            <p className="text-muted-fg text-xs mb-4">
              Create your first note to get started
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
