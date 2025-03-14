import { Heading } from "@/components/ui";
import type { CustomColor } from "@/lib/custom-colors";
import { getCustomColorClasses } from "@/lib/custom-colors";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { AddNoteCard } from "./add-note-card";
import { useHubNotes } from "./hooks/use-hub-notes";
import { NoteCard } from "./note-card";
import { SkeletonNoteCard } from "./note-card/skeleton-note-card";
import { quickNotesHubsQueryOptions } from "./utils";

interface HubNotesStackProps {
  hubId: number;
}

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

export const HubNotesStack = ({ hubId }: HubNotesStackProps) => {
  const { data: hubs } = useQuery(quickNotesHubsQueryOptions);
  const { data: notes, isLoading } = useHubNotes(hubId);

  const hub = hubs?.find((h) => h.id === hubId);
  const hasNotes = !!notes?.length;

  if (!hub) return null;

  const colorClasses = getCustomColorClasses(hub.color as CustomColor);

  return (
    <div className="flex flex-col gap-3 w-[320px] h-full shrink-0 bg-bg/  p-3 ">
      <div className="sticky top-2 z-10 backdrop-blur-sm flex gap-2">
        <Heading
          level={4}
          className={cn(
            "w-full p-2.5 rounded-lg text-sm font-semibold flex items-center justify-between",
            colorClasses.bg,
            colorClasses.text,
          )}
        >
          <span className="truncate">{hub.name}</span>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              "bg-fg/10 dark:bg-fg/20",
              colorClasses.text,
              "font-medium",
            )}
          >
            {notes?.length || 0}
          </span>
        </Heading>
        <AddNoteCard hubId={hub.id} />
      </div>

      <div className="h-full flex flex-col gap-3 relative">
        <AnimatePresence mode="popLayout" initial={false}>
          {isLoading ? (
            // Render skeleton cards while loading
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="will-change-transform origin-top"
              >
                <SkeletonNoteCard />
              </motion.div>
            ))
          ) : hasNotes ? (
            notes?.map((note, index) => (
              <motion.div
                layoutId={String(note.clientId || note.id)}
                key={note.clientId || note.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="will-change-transform origin-top"
              >
                <NoteCard note={note} index={index} hubColor={hub.color} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center h-32 text-muted-fg text-sm italic"
            >
              No notes yet
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
