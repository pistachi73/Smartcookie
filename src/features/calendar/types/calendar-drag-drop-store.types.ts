import type { Temporal } from "temporal-polyfill";

import type { LayoutCalendarSession } from "@/features/calendar/types/calendar.types";

export interface DragDropState {
  isDragging: boolean;
  draggedSession: LayoutCalendarSession | null;
  previewSession: LayoutCalendarSession | null;
  dropTarget: {
    date: Temporal.PlainDate;
    timeSlot: number; // 15-minute slot index
  } | null;
  lastTimeSlot: number | null;
  dragOffset: number; // Offset in 15-minute slots from the top of the session
}

export interface DragDropActions {
  startDrag: (session: LayoutCalendarSession, offset?: number) => void;
  updateDragPreview: (date: Temporal.PlainDate, timeSlot: number) => void;
  endDrag: () => void;
  getPreviewSession: (date: Temporal.PlainDate) => LayoutCalendarSession | null;
}

export type DragDropStore = DragDropState & DragDropActions;
