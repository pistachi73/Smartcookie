import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { add } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { getSnapToNearest15MinutesIndex } from "../utils";
import { HourMarker } from "./hour-marker";

const getTimeLabelFromSnapIndex = (snapIndex: number) => {
  const minutes = snapIndex * 15;
  const hours = Math.floor(minutes / 60).toString();
  const minutesRemainder = (minutes % 60).toString();
  return `${hours.padStart(2, "0")}:${minutesRemainder.padStart(2, "0")}`;
};

const getScrollableParent = (
  element: HTMLElement | null,
): HTMLElement | null => {
  if (!element) return null;
  const style = window.getComputedStyle(element);
  const isScrollable =
    style.overflowY === "auto" || style.overflowY === "scroll";

  if (isScrollable) return element;
  return getScrollableParent(element.parentElement);
};

const useDayEventsColumn = () =>
  useCalendarStore(
    useShallow(({ createDraftEvent }) => ({
      createDraftEvent,
    })),
  );

export const DayEventsColumn = ({
  children,
  date,
}: {
  children: React.ReactNode;
  date: Date;
}) => {
  const { createDraftEvent } = useDayEventsColumn();

  const scrollableParent = useRef<HTMLElement | null>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragEndY, setDragEndY] = useState<number | null>(null);
  const currentMouseYRef = useRef<number | null>(null);

  const dragState = useRef({
    startY: null as number | null,
    currentY: null as number | null,
    lastUpdate: 0,
  });

  useEffect(() => {
    scrollableParent.current = getScrollableParent(columnRef.current);
  }, []);

  // Memoize these calculations
  const getSnappedY = useCallback((clientY: number) => {
    if (!columnRef.current) return 0;
    const column = columnRef.current;
    const rect = column.getBoundingClientRect();
    const y = clientY - rect.top + column.scrollTop;
    return Math.max(0, Math.min(95, getSnapToNearest15MinutesIndex(y)));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const snappedY = getSnappedY(e.clientY);
    dragState.current.startY = snappedY;
    setDragStartY(snappedY);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const now = performance.now();
      if (now - dragState.current.lastUpdate < 16) return; // ~60fps

      dragState.current.lastUpdate = now;
      const snappedY = getSnappedY(e.clientY);

      currentMouseYRef.current = e.clientY;
      if (dragStartY === null || columnRef.current === null) return;
      // Only update state if value actually changed
      if (
        dragState.current.currentY !== snappedY &&
        Math.abs(snappedY - dragStartY) >= 1
      ) {
        dragState.current.currentY = snappedY;
        setDragEndY(snappedY);
      }
    },
    [dragStartY],
  );

  const handleMouseUp = useCallback(() => {
    // Use ref values instead of state for final calculation
    const startY = dragState.current.startY;
    const endY = dragState.current.currentY;

    if (startY !== null) {
      const startSlot = endY !== null ? Math.min(startY, endY) : startY - 1;
      const endSlot = endY !== null ? Math.max(startY, endY) : startY + 1;

      const startDate = add(date.setHours(0, 0, 0), {
        minutes: startSlot * 15,
      });
      const endDate = add(date.setHours(0, 0, 0), { minutes: endSlot * 15 });
      createDraftEvent(startDate, endDate);
    }

    // Reset all state at once
    dragState.current = { startY: null, currentY: null, lastUpdate: 0 };
    setDragStartY(null);
    setDragEndY(null);
  }, [date, createDraftEvent]);

  useEffect(() => {
    const abortController = new AbortController();
    let animationFrameId: number;

    if (dragStartY !== null) {
      window.addEventListener("mousemove", handleMouseMove, {
        signal: abortController.signal,
      });
      window.addEventListener("mouseup", handleMouseUp, {
        signal: abortController.signal,
      });

      const scrollLoop = () => {
        if (!scrollableParent.current || !currentMouseYRef.current) {
          animationFrameId = requestAnimationFrame(scrollLoop);
          return;
        }

        const parent = scrollableParent.current;
        const parentRect = parent.getBoundingClientRect();
        const cursorY = currentMouseYRef.current;
        const threshold = 48 / 4; // Distance from edge to start scrolling
        const maxSpeed = 15; // Maximum scroll speed (pixels per frame)

        const distanceFromTop = cursorY - parentRect.top;
        const distanceFromBottom = parentRect.bottom - cursorY;

        let scrollDelta = 0;

        if (distanceFromTop < threshold) {
          const speedFactor = (threshold - distanceFromTop) / threshold;
          scrollDelta = -maxSpeed * speedFactor;
        } else if (distanceFromBottom < threshold) {
          const speedFactor = (threshold - distanceFromBottom) / threshold;
          scrollDelta = maxSpeed * speedFactor;
        }

        parent.scrollTop += scrollDelta;
        animationFrameId = requestAnimationFrame(scrollLoop);
      };

      animationFrameId = requestAnimationFrame(scrollLoop);
    } else {
      abortController.abort();
    }

    return () => {
      abortController.abort();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [dragStartY, handleMouseMove, handleMouseUp]);

  return (
    <div className={cn("h-full w-full relative", dragEndY && "cursor-move!")}>
      <HourMarker date={date} />
      <div
        ref={columnRef}
        className="absolute top-0 left-0 h-full w-full"
        onMouseDown={handleMouseDown}
      />

      {children}
      {dragStartY !== null && dragEndY !== null && (
        <PreDraftEvent startIndex={dragStartY} endIndex={dragEndY} />
      )}
    </div>
  );
};

// PreDraftEvent component remains unchanged

const PreDraftEvent = ({
  startIndex,
  endIndex,
}: {
  startIndex: number;
  endIndex: number;
}) => {
  const realStartIndex = Math.min(startIndex, endIndex);
  const realEndIndex = Math.max(startIndex, endIndex);

  const height = Math.abs(endIndex - startIndex);
  const isShortEvent = height < 4;

  const startTimeLabel = getTimeLabelFromSnapIndex(realStartIndex);
  const endTimeLabel = getTimeLabelFromSnapIndex(realEndIndex);

  return (
    <div
      className="absolute left-0 right-0 z-30 pb-0.5 pr-1"
      style={{
        top: `calc(var(--row-height) / 4 * ${realStartIndex})`,
        height: `calc(var(--row-height) / 4 * ${height})`,
      }}
    >
      <div
        className={cn(
          "flex border px-1.5 h-full border-fg/70 bg-overlay-elevated-highlight/70 w-full overflow-hidden",
          isShortEvent
            ? "rounded-sm flex-row justify-between gap-1 items-center"
            : "rounded-md flex-col py-1.5  gap-0.5",
        )}
      >
        <p className="truncate font-semibold leading-tight text-xs">Untitled</p>

        <p
          className={cn("text-current/70 text-xs", !isShortEvent && "truncate")}
        >
          {isShortEvent
            ? startTimeLabel
            : `${startTimeLabel} - ${endTimeLabel}`}
        </p>
      </div>
    </div>
  );
};
