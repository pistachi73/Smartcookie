import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { add } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { getSnapToNearest15MinutesIndex } from "../utils";

const getTimeLabelFromSnapIndex = (snapIndex: number) => {
  const minutes = snapIndex * 15;
  const hours = Math.floor(minutes / 60).toString();
  const minutesRemainder = (minutes % 60).toString();
  return `${hours.padStart(2, "0")}:${minutesRemainder.padStart(2, "0")}`;
};

const useDayEventsColumn = () =>
  useCalendarStore(
    useShallow(({ createDraftEvent, setDraftEventOccurrence }) => ({
      createDraftEvent,
      setDraftEventOccurrence,
    })),
  );

export const DayEventsColumn = ({
  children,
  date,
}: {
  children: React.ReactNode;
  date: Date;
}) => {
  const { createDraftEvent, setDraftEventOccurrence } = useDayEventsColumn();

  const columnRef = useRef<HTMLDivElement>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragEndY, setDragEndY] = useState<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log("handleMouseDown");
    e.preventDefault();
    if (columnRef.current) {
      const rect = columnRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top + columnRef.current.scrollTop;
      const snappedY = getSnapToNearest15MinutesIndex(y);
      setDragStartY(snappedY);
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragStartY === null || columnRef.current === null) {
        return;
      }

      const column = columnRef.current;
      const rect = column.getBoundingClientRect();
      const y = e.clientY - rect.top + column.scrollTop; // Adjusted to include scrollTop
      const snappedY = Math.max(0, getSnapToNearest15MinutesIndex(y));
      if (Math.abs(snappedY - dragStartY) >= 1) {
        setDragEndY(snappedY);
      }
    },
    [dragStartY],
  );

  // Handles mouse up event to finalize drag
  const handleMouseUp = useCallback(() => {
    console.log("handleMouseUp");
    setDragStartY(null);
    setDragEndY(null);

    if (dragStartY == null) return;

    const startSlot =
      dragEndY !== null ? Math.min(dragStartY, dragEndY) : dragStartY - 1;
    const endSlot =
      dragEndY !== null ? Math.max(dragStartY, dragEndY) : dragStartY + 1;

    const startDate = add(date.setHours(0, 0, 0), { minutes: startSlot * 15 });
    const endDate = add(date.setHours(0, 0, 0), {
      minutes: endSlot * 15,
    });
    createDraftEvent(startDate, endDate);
  }, [date, setDraftEventOccurrence, dragStartY, dragEndY]);

  useEffect(() => {
    const abortController = new AbortController();
    if (dragStartY !== null) {
      window.addEventListener("mousemove", handleMouseMove, {
        signal: abortController.signal,
      });
      window.addEventListener("mouseup", handleMouseUp, {
        signal: abortController.signal,
      });
    } else {
      abortController.abort();
    }
    return () => {
      abortController.abort();
    };
  }, [dragStartY, handleMouseMove, handleMouseUp]);

  return (
    <div className={cn("h-full w-full relative", dragEndY && "cursor-move!")}>
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
      className="absolute left-0 right-0 z-30 pr-2 pb-0.5"
      style={{
        top: `calc(var(--row-height) / 4 * ${realStartIndex})`,
        height: `calc(var(--row-height) / 4 * ${height})`,
      }}
    >
      <div
        className={cn(
          "overflow-hidden text-left p-1.5 w-full h-full border border-responsive-dark/80 rounded-md bg-elevated-highlight/70",
          isShortEvent && "flex items-center py-0",
        )}
      >
        <p className="text-nowrap font-normal leading-tight mb-0.5 text-xs">
          (Untitled)
          {isShortEvent && (
            <span className="text-text-sub ml-2">{startTimeLabel}</span>
          )}
        </p>
        {!isShortEvent && (
          <span className="text-nowrap text-text-sub text-xs">
            {startTimeLabel} - {endTimeLabel}
          </span>
        )}
      </div>
    </div>
  );
};
