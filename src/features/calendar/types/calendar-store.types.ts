import type { CalendarView } from "@/features/calendar/types/calendar.types";
import type { Temporal } from "temporal-polyfill";

export type CalendarStore = CalendarState & CalendarActions;

export type CalendarState = {
  // Internal
  _isHydrated: boolean;
  sidebarOpen: boolean;

  selectedDate: Temporal.PlainDate;
  visibleDates: Temporal.PlainDate[];
  calendarView: CalendarView;
};

export type CalendarActions = {
  // Internal
  _setHydrated: () => void;

  toggleSidebar: () => void;

  selectDate: (date: Temporal.PlainDate) => void;
  setCalendarView: (calendarView: CalendarView) => void;
  setVisibleDates: (dates: Temporal.PlainDate[]) => void;

  onNavigation: (direction: number) => void;
  onToday: () => void;
};

export type InitialCalendarStateData = Omit<
  Partial<CalendarState>,
  "selectedDate"
> & {
  selectedDate?: string;
};
