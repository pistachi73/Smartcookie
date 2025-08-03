import { useQuery } from "@tanstack/react-query";

import { Heading } from "@/ui/heading";
import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";

import type { CustomColor } from "@/db/schema/shared";
import { quickNotesHubsQueryOptions } from "@/features/quick-notes/lib/quick-notes-query-options";
import { useHubNotes } from "../hooks/use-hub-notes";
import { AddNoteCard } from "./add-note-card";
import { NoteCardList } from "./note-card-list";

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
  const { data: notes } = useHubNotes(hubId);

  const hub = hubs?.find((h) => h.id === hubId);

  if (!hub) return null;

  const colorClasses = getCustomColorClasses(hub.color as CustomColor);

  return (
    <div
      id="hub-notes-stack"
      className="w-[320px] flex flex-col gap-3 shrink-0  p-3 hub-notes-stack"
    >
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
      <NoteCardList hubId={hub.id} hubColor={hub.color} />
    </div>
  );
};
