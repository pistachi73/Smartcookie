import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, type Variants } from "motion/react";
import * as m from "motion/react-m";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";

import type { SessionNotePosition } from "@/db/schema";
import { getHubByIdQueryOptions } from "@/features/hub/lib/hub-query-options";
import { getSessionNotesBySessionIdQueryOptions } from "@/features/hub/lib/session-notes-query-options";
import { AddSessionNoteForm } from "./add-session-note-form";
import { DraggableSessionNote } from "./draggable-session-note";
import { DroppableSessionNoteColumn } from "./droppable-session-note-column";

const variants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95,
  },
};

type SessionNoteColumnProps<T extends SessionNotePosition> = {
  position: T;
  sessionId: number;
  hubId: number;
};

const headerMap: Record<SessionNotePosition, string> = {
  plans: "To-Do",
  "in-class": "Done",
} as const;

export const SessionNoteColumn = <T extends SessionNotePosition>({
  hubId,
  position,
  sessionId,
}: SessionNoteColumnProps<T>) => {
  const { data: hub } = useQuery(getHubByIdQueryOptions(hubId));
  const viewOnlyMode = hub?.status === "inactive";
  const [isAddingNote, setIsAddingNote] = useState(false);

  const { data: sessionNotes } = useQuery({
    ...getSessionNotesBySessionIdQueryOptions(sessionId),
  });

  const notes = sessionNotes?.[position] ?? [];

  return (
    <DroppableSessionNoteColumn
      hubId={hubId}
      sessionId={sessionId}
      position={position}
    >
      <m.div
        layout
        className="mb-1 pr-0 flex flex-row items-center justify-between gap-x-2"
      >
        <Heading level={4} className="text-sm font-medium text-muted-fg">
          {headerMap[position]}
          <span
            className={cn(
              "ml-2 text-xs px-1 py-0.5 rounded-sm aspect-square",
              "bg-muted text-muted-fg",
              "font-medium",
            )}
          >
            {notes?.length ?? 0}
          </span>
        </Heading>
        <Button
          intent="plain"
          size="sq-sm"
          className="size-6"
          onPress={() => setIsAddingNote(true)}
          isDisabled={isAddingNote || viewOnlyMode}
        >
          <HugeiconsIcon icon={Add01Icon} size={12} />
        </Button>
      </m.div>
      <div className="flex flex-col gap-y-1">
        <AnimatePresence mode="popLayout">
          {isAddingNote && (
            <m.div
              key="adding-note"
              layout
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={regularSpring}
            >
              <AddSessionNoteForm
                hubId={hubId}
                onCancel={() => setIsAddingNote(false)}
                sessionId={sessionId}
                position={position}
              />
            </m.div>
          )}
          {notes?.length &&
            notes.map((note) => (
              <m.div
                key={note.clientId || `note-${note.id}`}
                layout
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={regularSpring}
              >
                <DraggableSessionNote
                  note={note}
                  sessionId={sessionId}
                  hubId={hubId}
                />
              </m.div>
            ))}
          {!notes?.length && !isAddingNote && (
            <m.div
              layout
              key="no-notes"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={regularSpring}
              className="flex flex-row items-center justify-center py-5"
            >
              <p className="text-sm text-muted-fg/50 italic">No notes</p>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </DroppableSessionNoteColumn>
  );
};
