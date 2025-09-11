import dynamic from "next/dynamic";
import { useRef } from "react";
import { useDrop } from "react-aria";
import type { Temporal } from "temporal-polyfill";

import { cn } from "@/shared/lib/classes";

import { useOptimizedDaySessions } from "@/features/calendar/hooks/use-optimized-calendar-sessions";
import { getSnapToNearest15MinutesIndex } from "@/features/calendar/lib/utils";
import { useCalendarDragDropStore } from "@/features/calendar/store/calendar-drag-drop-store";
import { useUpdateSession } from "@/features/hub/hooks/session/use-update-session";
import { DayViewPreviewSession } from "./day-view-session";

const DayViewSession = dynamic(
  () => import("./day-view-session").then((mod) => mod.DayViewSession),
  {
    ssr: false,
  },
);

const DragToCreateSession = dynamic(
  () =>
    import("./drag-to-create-session").then((mod) => mod.DragToCreateSession),
  {
    ssr: false,
  },
);

const HourMarker = dynamic(
  () => import("./hour-marker").then((mod) => mod.HourMarker),
  {
    ssr: false,
  },
);

export const DayColumn = ({ date }: { date: Temporal.PlainDate }) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const { sessions } = useOptimizedDaySessions(date);
  const { mutate: updateSession } = useUpdateSession();

  const { draggedSession, updateDragPreview, endDrag } =
    useCalendarDragDropStore();
  const previewSession = useCalendarDragDropStore((state) =>
    state.getPreviewSession(date),
  );

  const { dropProps } = useDrop({
    ref: columnRef,
    onDropMove: ({ y }) => {
      const timeSlot = getSnapToNearest15MinutesIndex(y);
      updateDragPreview(date, timeSlot);
    },
    onDrop: () => {
      if (!draggedSession || !previewSession) return;
      const { startTime, endTime } = previewSession;

      updateSession({
        sessionId: draggedSession.id,
        hubId: draggedSession.hub.id,
        data: {
          startTime,
          endTime,
          status: draggedSession.status,
          originalStartTime: draggedSession.startTime,
        },
      });

      setTimeout(() => {
        endDrag();
      }, 10);
    },
  });

  return (
    <div
      ref={columnRef}
      {...dropProps}
      className={cn("h-full w-full relative")}
      role="application"
      aria-label="Calendar day view"
    >
      <DragToCreateSession date={date} />
      <HourMarker date={date} />

      {sessions?.map((session) => (
        <DayViewSession
          key={`calendar-session-${session.id}`}
          session={session}
        />
      ))}

      {previewSession && <DayViewPreviewSession session={previewSession} />}
    </div>
  );
};
