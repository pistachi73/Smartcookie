import type { CustomColor } from "@/db/schema/shared";
import { quickNotesHubsQueryOptions } from "@/features/notes/lib/quick-notes-query-options";
import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";
import { Heading } from "@/ui/heading";
import { NoteIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useHubNotes } from "../hooks/use-hub-notes";
import { AddNoteCard } from "./add-note-card";
import { NoteCard } from "./note-card";
import { SkeletonNoteCard } from "./note-card/skeleton-note-card";

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
    <div className="flex flex-col gap-3 w-[320px] h-full shrink-0  p-3">
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
                layoutId={String(note.clientId || note.id)}
                key={note.clientId || note.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="will-change-transform origin-top "
              >
                <NoteCard note={note} hubColor={hub.color} />
              </m.div>
            ))
          ) : (
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
              className=" bg-overlay-highlight rounded-lg h-auto flex flex-col items-center py-8 px-4 text-center"
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
    </div>
  );
};
