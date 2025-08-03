import { CalendarDate, Time } from "@internationalized/date";
import { useCallback, useEffect, useRef, useState } from "react";
import { Temporal } from "temporal-polyfill";
import { useShallow } from "zustand/react/shallow";

import {
  getCurrentTimezone,
  getSnapToNearest15MinutesIndex,
} from "@/features/calendar/lib/utils";
import { useCalendarStore } from "../providers/calendar-store-provider";

export const getTimeLabelFromSnapIndex = (snapIndex: number) => {
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

export const useDragToCreateSession = ({
  date,
}: {
  date: Temporal.PlainDate;
}) => {
  const { setDefaultSessionFormData, setIsCreateSessionModalOpen } =
    useCalendarStore(
      useShallow((store) => ({
        setDefaultSessionFormData: store.setDefaultSessionFormData,
        setIsCreateSessionModalOpen: store.setIsCreateSessionModalOpen,
      })),
    );
  const scrollableParent = useRef<HTMLElement | null>(null);
  const ref = useRef<HTMLButtonElement>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragEndY, setDragEndY] = useState<number | null>(null);
  const currentMouseYRef = useRef<number | null>(null);

  const dragState = useRef({
    startY: null as number | null,
    currentY: null as number | null,
    lastUpdate: 0,
  });

  useEffect(() => {
    scrollableParent.current = getScrollableParent(ref.current);
  }, []);

  // Memoize these calculations
  const getSnappedY = useCallback((clientY: number) => {
    if (!ref.current) return 0;
    const column = ref.current;
    const rect = column.getBoundingClientRect();
    const y = clientY - rect.top + column.scrollTop;
    return Math.max(0, Math.min(95, getSnapToNearest15MinutesIndex(y)));
  }, []);

  const startDrag = useCallback(
    (clientY: number) => {
      const snappedY = getSnappedY(clientY);
      dragState.current.startY = snappedY;
      setDragStartY(snappedY);
    },
    [getSnappedY],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startDrag(e.clientY);
  };

  const updateDrag = useCallback(
    (clientY: number) => {
      const now = performance.now();
      if (now - dragState.current.lastUpdate < 16) return; // ~60fps

      dragState.current.lastUpdate = now;
      const snappedY = getSnappedY(clientY);

      currentMouseYRef.current = clientY;
      if (dragStartY === null || ref.current === null) return;
      // Only update state if value actually changed
      if (
        dragState.current.currentY !== snappedY &&
        Math.abs(snappedY - dragStartY) >= 1
      ) {
        dragState.current.currentY = snappedY;
        setDragEndY(snappedY);
      }
    },
    [dragStartY, getSnappedY],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      updateDrag(e.clientY);
    },
    [updateDrag],
  );

  const finalizeDrag = useCallback(() => {
    // Use ref values instead of state for final calculation
    const startY = dragState.current.startY;
    const endY = dragState.current.currentY;

    if (startY !== null) {
      const startSlot = endY !== null ? Math.min(startY, endY) : startY - 1;
      const endSlot = endY !== null ? Math.max(startY, endY) : startY + 1;
      const timezoneId = getCurrentTimezone().id;

      const startDate = date.toZonedDateTime({
        timeZone: timezoneId,
        plainTime: Temporal.PlainTime.from({ hour: 0, minute: 0 }).add({
          minutes: startSlot * 15,
        }),
      });

      const endDate = date.toZonedDateTime({
        timeZone: timezoneId,
        plainTime: Temporal.PlainTime.from({ hour: 0, minute: 0 }).add({
          minutes: endSlot * 15,
        }),
      });

      setDefaultSessionFormData({
        startTime: new Time(
          startDate.toPlainTime().hour,
          startDate.toPlainTime().minute,
        ),
        endTime: new Time(
          endDate.toPlainTime().hour,
          endDate.toPlainTime().minute,
        ),
        date: new CalendarDate(startDate.year, startDate.month, startDate.day),
      });

      setIsCreateSessionModalOpen(true);
    }

    // Reset all state at once
    dragState.current = { startY: null, currentY: null, lastUpdate: 0 };
    setDragStartY(null);
    setDragEndY(null);
  }, [date, setDefaultSessionFormData, setIsCreateSessionModalOpen]);

  const handleMouseUp = useCallback(() => {
    finalizeDrag();
  }, [finalizeDrag]);

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

  return {
    ref,
    dragStartY,
    dragEndY,
    handleMouseDown,
  };
};
