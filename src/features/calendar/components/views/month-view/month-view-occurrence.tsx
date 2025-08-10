import { format } from "date-fns";
import { useRef } from "react";
import { DragPreview, useDrag } from "react-aria";
import { Button, type DragPreviewRenderer } from "react-aria-components";
import { tv } from "tailwind-variants";

import { Popover, type PopoverContentProps } from "@/ui/popover";
import { cn } from "@/shared/lib/classes";

import { getCalendarColor } from "@/features/calendar/lib/utils";
import { useCalendarDragDropStore } from "@/features/calendar/store/calendar-drag-drop-store";
import type { LayoutCalendarSession } from "@/features/calendar/types/calendar.types";
import { SessionPopover } from "../../session-popover-content";

const monthViewOccurrenceVariants = tv({
  base: [
    "pointer-events-auto w-full text-xs p-0.5 sm:p-1 px-1 rounded-sm",
    "flex gap-1 items-center transition-colors cursor-pointer overflow-hidden",
    "flex items-center gap-2",
    "outline-0 outline-offset-2 hover:no-underline focus-visible:outline-2 outline-primary",
  ],
  variants: {
    isEditing: {
      true: "border-fg",
      false: "",
    },
    isDragging: {
      true: "opacity-50",
      false: "",
    },
  },
  defaultVariants: {
    isEditing: false,
    isDragging: false,
  },
});

const timeTextVariants = tv({
  base: "tabular-nums font-medium",
  variants: {
    showTime: {
      true: "block",
      false: "hidden sm:block",
    },
  },
});

const titleTextVariants = tv({
  base: "whitespace-nowrap sm:truncate font-medium leading-tight",
});

export const MonthViewOccurrence = ({
  session,
  className,
  popoverProps,
  showTime = true,
}: {
  session: LayoutCalendarSession;
  className?: string;
  popoverProps?: Omit<PopoverContentProps, "children">;
  showTime?: boolean;
}) => {
  const previewRef = useRef<DragPreviewRenderer>(null);
  const ref = useRef<HTMLDivElement>(null);
  const color = getCalendarColor(session.hub?.color);
  const isEditing = false; // We can implement this later if needed

  const { startDrag, endDrag } = useCalendarDragDropStore();

  const { dragProps, isDragging } = useDrag({
    getItems() {
      return [
        {
          "calendar-session": JSON.stringify({
            id: session.id,
            startTime: session.startTime,
            endTime: session.endTime,
            hubId: session.hub?.id,
          }),
        },
      ];
    },
    onDragStart: () => {
      startDrag(session, 0);
    },
    onDragEnd: () => {
      endDrag();
    },
    preview: previewRef,
  });

  return (
    <>
      <Popover>
        <div ref={ref} {...dragProps}>
          <Button
            className={cn(
              monthViewOccurrenceVariants({ isEditing, isDragging }),
              className,
              color?.className,
            )}
          >
            <p className={timeTextVariants({ showTime })}>
              {format(session.startTime, "HH:mm")}
            </p>
            <p className={titleTextVariants()}>
              {session.hub?.name || "Untitled"}
            </p>
          </Button>
        </div>
        <SessionPopover
          session={session}
          popoverProps={{
            placement: "top",
            ...popoverProps,
          }}
        />
      </Popover>
      <DragPreview ref={previewRef}>
        {() => {
          return (
            <svg
              width="1"
              height="1"
              aria-hidden="true"
              role="presentation"
              className="opacity-0 pointer-events-none"
            />
          );
        }}
      </DragPreview>
    </>
  );
};

export const MonthViewPreviewOccurrence = ({
  session,
  className,
}: {
  session: LayoutCalendarSession;
  className?: string;
}) => {
  const color = getCalendarColor(session.hub?.color);

  return (
    <div
      className={cn(monthViewOccurrenceVariants(), className, color?.className)}
    >
      <p className={timeTextVariants()}>{format(session.startTime, "HH:mm")}</p>
      <p className={titleTextVariants()}>{session.hub?.name || "Untitled"}</p>
    </div>
  );
};
