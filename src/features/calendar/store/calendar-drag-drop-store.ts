import { add } from "date-fns";
import type { Temporal } from "temporal-polyfill";
import { create } from "zustand";

import type { LayoutCalendarSession } from "@/features/calendar/types/calendar.types";
import type { DragDropStore } from "@/features/calendar/types/calendar-drag-drop-store.types";

export const useCalendarDragDropStore = create<DragDropStore>((set, get) => ({
  // Initial state
  isDragging: false,
  draggedSession: null,
  previewSession: null,
  dropTarget: null,
  dragStartSession: null,
  lastTimeSlot: null,
  dragOffset: 0,

  // Actions
  startDrag: (session: LayoutCalendarSession, offset = 0) => {
    set({
      isDragging: true,
      draggedSession: session,
      previewSession: null,
      dropTarget: null,
      lastTimeSlot: null,
      dragOffset: offset,
    });
  },

  updateDragPreview: (date: Temporal.PlainDate, timeSlot: number) => {
    const { draggedSession, lastTimeSlot, dropTarget, dragOffset } = get();

    if (!draggedSession) return;
    if (lastTimeSlot === timeSlot && dropTarget?.date.equals(date)) return;

    const originalStart = new Date(draggedSession.startTime);
    const originalEnd = new Date(draggedSession.endTime);
    const durationInMinutes =
      (originalEnd.getTime() - originalStart.getTime()) / (60 * 1000);
    const slotDuration = Math.floor(durationInMinutes / 15);

    const topTimeSlot = timeSlot - dragOffset;
    const bottomTimeSlot = topTimeSlot + slotDuration;

    const topSlotsOverflow = topTimeSlot < 0 ? topTimeSlot * -1 : 0;
    const bottomSlotsOverflow = bottomTimeSlot > 96 ? bottomTimeSlot - 96 : 0;

    const removedEndMinutes = topSlotsOverflow * 15;
    const addedStartMinutes = bottomSlotsOverflow * 15;

    const startTimeInMinutes = Math.max(0, topTimeSlot) * 15;
    const startHour = Math.max(0, Math.floor(startTimeInMinutes / 60));
    const startMinute = Math.max(0, startTimeInMinutes % 60);

    const newStartTime = new Date(date.year, date.month - 1, date.day);
    newStartTime.setHours(startHour, startMinute, 0, 0);

    const adjustedDuration = Math.max(
      15,
      durationInMinutes - addedStartMinutes - removedEndMinutes,
    );

    const newEndTime = add(newStartTime, { minutes: adjustedDuration });
    if (newEndTime.getDate() !== newStartTime.getDate()) {
      newEndTime.setDate(newEndTime.getDate() - 1);
      newEndTime.setHours(24, 0, 0, 0);
    }

    const previewSession: LayoutCalendarSession = {
      ...draggedSession,
      startTime: newStartTime.toISOString(),
      endTime: newEndTime.toISOString(),
      id: -1,
    };

    set({
      previewSession,
      dropTarget: { date, timeSlot },
      lastTimeSlot: timeSlot,
    });
  },

  endDrag: () => {
    set({
      isDragging: false,
      draggedSession: null,
      previewSession: null,
      dropTarget: null,
      lastTimeSlot: null,
      dragOffset: 0,
    });
  },
  getPreviewSession: (date: Temporal.PlainDate) => {
    const { previewSession, dropTarget } = get();
    if (!previewSession || !dropTarget) return null;
    return dropTarget.date.equals(date) ? previewSession : null;
  },
}));
