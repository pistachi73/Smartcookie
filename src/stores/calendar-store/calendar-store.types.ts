import type {
  CalendarView,
  LayoutOccurrence,
  UIOccurrence,
} from "@/components/portal/calendar/calendar.types";
import type { Event, Hub, Occurrence } from "@/db/schema";
import type { Temporal } from "@js-temporal/polyfill";

export type CalendarStore = CalendarState & CalendarActions;

export type CalendarState = {
  // Internal
  _isHydrated: boolean;

  hubs: Hub[];
  selectedDate: Temporal.PlainDate;
  visibleDates: Temporal.PlainDate[];
  calendarView: CalendarView;

  events: Map<number, Event>;
  occurrences: Map<number, Occurrence>;

  //Cache fields
  cachedLayoutOccurrences: Map<string, LayoutOccurrence[]>;
  cachedUIOccurrences: Map<number, UIOccurrence>;

  // Dirty Fields
  //dirtyDays: Set<string>;
  //dirtyOccurrences: Set<number>;
};

export type CalendarActions = {
  // Internal
  _setHydrated: () => void;

  selectDate: (date: Temporal.PlainDate) => void;
  setCalendarView: (calendarView: CalendarView) => void;
  setVisibleDates: (dates: Temporal.PlainDate[]) => void;

  onNavigation: (direction: number) => void;
  onToday: () => void;

  // Getters
  getLayoutOccurrences: (dayKey: string) => LayoutOccurrence[] | null;
  updateLayoutCache: (dayKey: string, occurrences: LayoutOccurrence[]) => void;

  getUIOccurrence: (id: number) => UIOccurrence | null;
  cacheUIOccurrence: (id: number, occurrence: UIOccurrence) => void;

  // Dirty Fields
  // recomputeDirtyOccurrences: () => void;
  // recomputeDirtyDays: () => void;

  // CRUD
  addEvents: (events: Event | Event[]) => void;
  addOccurrences: (occurrences: Occurrence | Occurrence[]) => void;
  updateEvents: (
    events:
      | (Partial<Event> & Pick<Event, "id">)
      | Array<Partial<Event> & Pick<Event, "id">>,
    options?: { silent?: boolean; mergeStrategy?: "shallow" | "deep" },
  ) => void;
  updateOccurrences: (
    occurrences:
      | (Partial<Occurrence> & Pick<Occurrence, "id">)
      | Array<Partial<Occurrence> & Pick<Occurrence, "id">>,
    options?: { silent?: boolean; mergeStrategy?: "shallow" | "deep" },
  ) => void;
  removeEvents: (
    ids: number | number[],
    options?: { silent?: boolean },
  ) => void;
  removeOccurrences: (
    ids: number | number[],
    options?: { silent?: boolean },
  ) => void;
};

export type InitialCalendarStateData = Omit<
  Partial<CalendarState>,
  "occurrences" | "events" | "selectedDate"
> & {
  selectedDate?: string;
  occurrences?: Occurrence[];
  events?: Event[];
};
