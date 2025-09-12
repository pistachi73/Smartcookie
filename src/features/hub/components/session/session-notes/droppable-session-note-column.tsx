import * as m from "motion/react-m";
import { useRef } from "react";
import { isTextDropItem, useDrop } from "react-aria";

import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";

import type { SessionNotePosition } from "@/db/schema";
import { useUpdateSessionNotePosition } from "../../../hooks/session-notes/use-update-session-note-position";
import type { ClientSessionNote } from "../../../types/session-notes.types";
export const DroppableSessionNoteColumn = ({
  children,
  sessionId,
  position,
}: {
  children?: React.ReactNode;
  sessionId: number;
  position: SessionNotePosition;
}) => {
  const { mutate: updateSessionNote } = useUpdateSessionNotePosition();
  const ref = useRef(null);
  const { dropProps, isDropTarget } = useDrop({
    ref,
    async onDrop(e) {
      const [item] = (await Promise.all(
        e.items
          .filter(isTextDropItem)
          .map(async (item) => JSON.parse(await item.getText("session-note"))),
      )) as ClientSessionNote[];

      if (!item) return;

      const source = {
        sessionId: item.sessionId,
        position: item.position,
      };

      const target = {
        sessionId,
        position,
      };

      if (JSON.stringify(source) === JSON.stringify(target)) {
        return;
      }

      console.log({ source, target });

      updateSessionNote({
        noteId: item.id,
        source,
        target,
      });
    },
  });

  return (
    //@ts-expect-error
    <m.div
      layout
      transition={{
        layout: regularSpring,
      }}
      {...dropProps}
      ref={ref}
      role="button"
      tabIndex={0}
      className={cn(
        "relative p-1 rounded-lg  border border-transparent",
        "transition-colors overflow-hidden duration-200",
        "focus-visible:border-primary focus-visible:bg-primary-tint",
        isDropTarget && "border-primary/30 bg-primary-tint",
      )}
    >
      {children}
    </m.div>
  );
};
