import {
  TIMESLOT_HEIGHT,
  getEventOccurrenceDayKey,
} from "@/components/portal/calendar/utils";
import type { EventOccurrence, Hub } from "@/db/schema";
import {
  groupEventOccurrencesByDayAndTime,
  sweepLineGroupOverlappingOccurrences,
} from "@/lib/group-overlapping-occurrences";
import {
  CalendarDateTime,
  Time,
  getLocalTimeZone,
} from "@internationalized/date";
import { addDays, addMonths, addWeeks } from "date-fns";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";
import { superjsonStorage } from "./superjson-storage";

export type CalendarView = "day" | "week" | "month" | "agenda";
export type SidebarType = "main" | "edit-session";
export type DraftEventOccurrence = Partial<EventOccurrence> & {
  startTime: Date;
  endTime: Date;
  timezone: string;
};
export type CalendarState = {
  _isHydrated: boolean;
  activeSidebar: SidebarType;
  selectedDate: Date;
  calendarView: CalendarView;
  hubs: Hub[];
  eventOccurrences?: Record<string, EventOccurrence>;
  groupedEventOccurrences: ReturnType<typeof groupEventOccurrencesByDayAndTime>;
  editingEventOccurrenceId?: number;
  draftEventOccurrence: DraftEventOccurrence;
};

export type CalendarActions = {
  _setHydrated: () => void;
  selectDate: (date: Date) => void;
  setCalendarView: (calendarView: CalendarView) => void;
  setActiveSidebar: (sidebar: SidebarType) => void;
  onNavigation: (n: number) => void;
  onToday: () => void;
  handleCalendarColumnDoubleClick: (
    event: React.MouseEvent<HTMLDivElement>,
    date: Date,
  ) => void;
  regenerateGroupedEventOccurrencesForDay: (dayKey: string[]) => void;
  navigateToEditEventOccurrence: (eventOccurrenceId: number) => void;
  setDraftEventOccurrence: (
    eventOccurrence: Partial<DraftEventOccurrence>,
  ) => void;
  clearDraftEventOccurrence: () => void;
  clearEditingEventOccurrence: () => void;
};

export type CalendarStore = CalendarState & CalendarActions;

export const initCalendarStore = (
  initilData?: Partial<CalendarState>,
): CalendarState => {
  return {
    _isHydrated: initilData?._isHydrated || false,
    hubs: initilData?.hubs || [],
    eventOccurrences: initilData?.eventOccurrences || {},
    groupedEventOccurrences: groupEventOccurrencesByDayAndTime(
      initilData?.eventOccurrences
        ? Object.values(initilData?.eventOccurrences)
        : [],
    ),
    selectedDate: initilData?.selectedDate || new Date(),
    calendarView: initilData?.calendarView || "week",
    activeSidebar: initilData?.activeSidebar || "main",
    editingEventOccurrenceId: initilData?.editingEventOccurrenceId || undefined,
    draftEventOccurrence: {} as DraftEventOccurrence,
  };
};

export const defaultInitState: CalendarState = initCalendarStore();

export const createCalendarStore = (
  initState: CalendarState = defaultInitState,
  skipHydration = false,
) => {
  return createStore<CalendarStore>()(
    persist(
      immer((set, get) => ({
        ...initState,
        _setHydrated: () => set({ _isHydrated: true }),
        selectDate: (selectedDate: Date) => {
          updateURL({ calendarView: get().calendarView, selectedDate });
          return set((state) => {
            state.selectedDate = selectedDate;
          });
        },
        setCalendarView: (calendarView: CalendarView) => {
          updateURL({ calendarView, selectedDate: get().selectedDate });
          return set(() => ({ calendarView }));
        },
        setActiveSidebar: (activeSidebar: SidebarType) =>
          set(() => ({ activeSidebar })),
        onToday: () => {
          const today = new Date();
          updateURL({
            calendarView: get().calendarView,
            selectedDate: today,
          });
          return set((state) => {
            state.selectedDate = today;
          });
        },
        onNavigation: (n: number) => {
          const calendarView = get().calendarView;
          const selectedDate = get().selectedDate;

          const navigationDate = onNavigationFunctionMapper[calendarView](
            selectedDate,
            n,
          );

          updateURL({
            calendarView: get().calendarView,
            selectedDate: navigationDate,
          });
          return set(() => {
            return { selectedDate: navigationDate };
          });
        },

        handleCalendarColumnDoubleClick: (
          event: React.MouseEvent<HTMLDivElement>,
          date: Date,
        ) => {
          const container = event.currentTarget;
          const top = event.clientY - container.getBoundingClientRect().top;
          const timeslotPosition = Math.trunc(top / TIMESLOT_HEIGHT);

          const startTime = new Time(0, 0).add({
            minutes: timeslotPosition * 15,
          });

          const startDate = new CalendarDateTime(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            startTime.hour,
            startTime.minute,
          );

          const endDate = startDate.add({ minutes: 30 });

          const overrides = [startDate.toString(), endDate.toString()];
          const encodedOverrides = encodeURIComponent(
            JSON.stringify(overrides),
          );
          const params = new URLSearchParams({
            overrides: encodedOverrides,
          });

          window.history.pushState(
            null,
            "",
            `/calendar/event/create?${params.toString()}`,
          );

          console.log({ startDateStromg: startDate.toString() });
          const timezone = getLocalTimeZone();
          const newDraftEventOccurrence: DraftEventOccurrence = {
            eventOccurrenceId: -1,
            startTime: startDate.toDate(timezone),
            endTime: endDate.toDate(timezone),
            timezone,
          };

          get().setDraftEventOccurrence(newDraftEventOccurrence);
          get().setActiveSidebar("edit-session");
        },

        setDraftEventOccurrence: (
          draftEventOccurrence: Partial<DraftEventOccurrence>,
        ) => {
          console.log("setDraftEventOccurrence", draftEventOccurrence);
          const prevDraftOccurrence = get().draftEventOccurrence;

          const newDraftEventOccurrence = {
            ...prevDraftOccurrence,
            ...draftEventOccurrence,
          };
          set((state) => {
            state.draftEventOccurrence = newDraftEventOccurrence;
          });

          const dayKeys = new Set<string>([
            getEventOccurrenceDayKey(prevDraftOccurrence.startTime),
            getEventOccurrenceDayKey(newDraftEventOccurrence.startTime),
          ]);

          get().regenerateGroupedEventOccurrencesForDay(Array.from(dayKeys));
        },

        clearDraftEventOccurrence: () => {
          const draftEventOccurrence = get().draftEventOccurrence;
          if (!draftEventOccurrence) return;

          set((state) => {
            state.draftEventOccurrence = {} as DraftEventOccurrence;
          });

          get().regenerateGroupedEventOccurrencesForDay([
            getEventOccurrenceDayKey(draftEventOccurrence.startTime),
          ]);
        },
        regenerateGroupedEventOccurrencesForDay: (dayKeys: string[]) => {
          dayKeys.forEach((dayKey) => {
            const dayEvents = [
              ...Object.values(get().eventOccurrences!),
              get().draftEventOccurrence,
            ].filter(
              (e) =>
                e.startTime && getEventOccurrenceDayKey(e.startTime) === dayKey,
            );
            set((state) => {
              state.groupedEventOccurrences[dayKey] =
                sweepLineGroupOverlappingOccurrences(dayEvents);
            });
          });
        },
        navigateToEditEventOccurrence: (eventOccurrenceId: number) => {
          set((state) => {
            state.activeSidebar = "edit-session";
            state.editingEventOccurrenceId = eventOccurrenceId;
          });

          window.history.pushState(
            null,
            "",
            `/calendar/event/${eventOccurrenceId}`,
          );
        },
        clearEditingEventOccurrence: () => {
          set((state) => {
            state.editingEventOccurrenceId = undefined;
          });
        },
      })),
      {
        name: "calendar-store",
        storage: superjsonStorage,
        partialize: ({ calendarView, selectedDate }) => ({
          calendarView,
          selectedDate,
        }),
        skipHydration,
        onRehydrateStorage: () => {
          return (state, error) => {
            if (!error) state?._setHydrated();
          };
        },
      },
    ),
  );
};

const updateURL = ({
  calendarView,
  selectedDate,
}: { calendarView: CalendarView; selectedDate: Date }) => {
  const [year, month, day] = [
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    selectedDate.getDate(),
  ];

  window.history.pushState(
    null,
    "",
    `/calendar/${calendarView}/${year}/${month}/${day}/`,
  );
};

const onNavigationFunctionMapper: Record<
  CalendarView,
  (date: Date, n: number) => Date
> = {
  day: addDays,
  week: addWeeks,
  month: addMonths,
  agenda: addDays,
};
