import type { Temporal } from "temporal-polyfill";
import type { z } from "zod";

import type { CalendarView } from "@/features/calendar/types/calendar.types";
import type { AddSessionFormSchema } from "@/features/hub/components/session/add-sessions-form";

export type CalendarStore = CalendarState & CalendarActions;

export type CalendarState = {
  sidebarOpen: boolean;
  isCreateSessionModalOpen: boolean;
  selectedDate: Temporal.PlainDate;
  visibleDates: Temporal.PlainDate[];
  calendarView: CalendarView;

  // Create session modal
  defaultSessionFormData: Partial<z.infer<typeof AddSessionFormSchema>> | null;
};

export type CalendarActions = {
  toggleSidebar: () => void;
  setIsCreateSessionModalOpen: (open: boolean) => void;

  selectDate: (date: Temporal.PlainDate) => void;
  setCalendarView: (calendarView: CalendarView) => void;
  setVisibleDates: (dates: Temporal.PlainDate[]) => void;
  set1DayView: (date: Temporal.PlainDate) => void;

  onNavigation: (direction: number) => void;
  onToday: () => void;

  setDefaultSessionFormData: (
    values: Partial<z.infer<typeof AddSessionFormSchema>>,
  ) => void;
};

export type InitialCalendarStateData = Omit<
  Partial<CalendarState>,
  "selectedDate"
> & {
  selectedDate?: string;
};
