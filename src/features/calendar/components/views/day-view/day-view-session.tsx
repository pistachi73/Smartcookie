import { format } from "date-fns";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { DragPreview, type DragPreviewRenderer, useDrag } from "react-aria";
import { Button } from "react-aria-components";

import { Popover } from "@/ui/popover";
import { cn } from "@/shared/lib/classes";

import {
  calculateOccurrenceHeight,
  calculateOccurrenceTop,
  getCalendarColor,
  PIXELS_PER_15_MINUTES,
} from "@/features/calendar/lib/utils";
import { useCalendarDragDropStore } from "@/features/calendar/store/calendar-drag-drop-store";
import type { LayoutCalendarSession } from "@/features/calendar/types/calendar.types";

const LazyPopoverContent = dynamic(() =>
  import("../../session-popover-content").then((mod) => mod.SessionPopover),
);

type DayViewSessionProps = {
  session: LayoutCalendarSession;
};

export const DayViewSession = ({ session }: DayViewSessionProps) => {
  const previewRef = useRef<DragPreviewRenderer>(null);
  const ref = useRef<HTMLDivElement>(null);
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
    onDragStart: (e) => {
      let offset = 0;
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const relativeY = e.y - rect.top;
        const offsetInPixels = Math.max(0, relativeY);
        offset = Math.floor(offsetInPixels / PIXELS_PER_15_MINUTES);
      }
      startDrag(session, offset);
    },
    onDragEnd: () => {
      endDrag();
    },
    preview: previewRef,
  });

  if (!session) return null;

  const startTimeDate = new Date(session.startTime);
  const endTimeDate = new Date(session.endTime);

  const heightPx = calculateOccurrenceHeight(startTimeDate, endTimeDate);

  const topPx = calculateOccurrenceTop({
    hours: startTimeDate.getHours(),
    minutes: startTimeDate.getMinutes(),
  });

  const startTimeLabel = format(startTimeDate, "HH:mm");
  const endTimeLabel = format(endTimeDate, "HH:mm");
  const eventColor = getCalendarColor(session.hub?.color);

  const widthPercentage = 100 / session.totalColumns;
  const isShortEvent = heightPx / PIXELS_PER_15_MINUTES <= 2;

  return (
    <>
      <Popover>
        <div
          ref={ref}
          {...dragProps}
          className="absolute z-10  pb-0.5 pr-1"
          style={{
            top: `${topPx}px`,
            height: `${heightPx}px`,
            width: `${widthPercentage}%`,
            left: `${session.columnIndex * widthPercentage}%`,
          }}
        >
          <Button
            className={cn(
              "flex items-start relative h-full w-full overflow-hidden group-focus-visible:outline-2 group-focus-visible:outline-primary group-focus-visible:outline-offset-2",
              eventColor?.className,
              isShortEvent ? "rounded-sm" : "rounded-sm sm:rounded-md",
              isDragging && "opacity-50",
            )}
          >
            <div
              className={cn(
                "text-left px-1.5 flex w-full",
                isShortEvent
                  ? "flex-row justify-between gap-1 h-full items-center"
                  : "flex-col py-1.5  gap-0.5",
              )}
            >
              <p className="font-semibold leading-tight text-xs whitespace-nowrap">
                {session.hub?.name ? session.hub.name : "Untitled"}
              </p>

              <p
                className={cn(
                  "text-current/70 text-xs ",
                  !isShortEvent && "whitespace-nowrap",
                )}
              >
                {isShortEvent
                  ? startTimeLabel
                  : `${startTimeLabel} - ${endTimeLabel}`}
              </p>
            </div>
          </Button>
          <div className="w-full absolute top-0 cursor-ns-resize right-0 h-1 bg-transparent group-hover:bg-current/10 transition-colors">
            <div className="absolute top-1/2 right-1 -translate-y-1/2 w-1.5 h-1.5 bg-current/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="w-full absolute bottom-0 cursor-ns-resize right-0 h-1 bg-transparent group-hover:bg-current/10 transition-colors">
            <div className="absolute top-1/2 right-1 -translate-y-1/2 w-1.5 h-1.5 bg-current/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <LazyPopoverContent
          session={session}
          popoverProps={{
            placement: "right",
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

export const DayViewPreviewSession = ({
  session,
}: {
  session: LayoutCalendarSession;
}) => {
  const startTimeDate = new Date(session.startTime);
  const endTimeDate = new Date(session.endTime);

  const heightPx = calculateOccurrenceHeight(startTimeDate, endTimeDate);
  const eventColor = getCalendarColor(session.hub?.color);

  const topPx = calculateOccurrenceTop({
    hours: startTimeDate.getHours(),
    minutes: startTimeDate.getMinutes(),
  });

  const startTimeLabel = format(startTimeDate, "HH:mm");
  const endTimeLabel = format(endTimeDate, "HH:mm");

  const isShortEvent = heightPx / PIXELS_PER_15_MINUTES <= 2;
  return (
    <div
      className={cn(
        "absolute pb-0.5 z-10 transition-transform duration-300 ease-in-out group w-full",
      )}
      style={{
        top: `${topPx}px`,
        height: `${heightPx}px`,
      }}
    >
      <div
        className={cn(
          "flex items-start relative h-full w-full overflow-hidden group-focus-visible:outline-2 group-focus-visible:outline-primary group-focus-visible:outline-offset-2 border",
          eventColor?.className,
          isShortEvent ? "rounded-sm" : "rounded-md",
        )}
      >
        <div
          className={cn(
            "text-left px-1.5 flex w-full",
            isShortEvent
              ? "flex-row justify-between gap-1 h-full items-center"
              : "flex-col py-1.5  gap-0.5",
          )}
        >
          <p className="font-semibold leading-tight text-xs whitespace-nowrap">
            {session.hub?.name ? session.hub.name : "Untitled"}
          </p>

          <p
            className={cn(
              "text-current/70 text-xs ",
              !isShortEvent && "whitespace-nowrap",
            )}
          >
            {isShortEvent
              ? startTimeLabel
              : `${startTimeLabel} - ${endTimeLabel}`}
          </p>
        </div>
      </div>
    </div>
  );
};
