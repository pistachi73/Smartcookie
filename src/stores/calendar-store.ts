import { TIMESLOT_HEIGHT } from "@/components/portal/calendar/utils";
import { CalendarDateTime, Time } from "@internationalized/date";
import { addDays, addMonths, addWeeks } from "date-fns";
import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { superjsonStorage } from "./superjson-storage";

export type CalendarView = "day" | "week" | "month" | "agenda";
export type SidebarType = "main" | "edit-session";

export type CalendarState = {
  _isHydrated: boolean;
  activeSidebar: SidebarType;
  selectedDate: Date;
  calendarView: CalendarView;

  // draftSessionOccurrence:SessionOccurrence
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
};

export type CalendarStore = CalendarState & CalendarActions;

export const initCalendarStore = (
  initilData?: Partial<CalendarState>,
): CalendarState => {
  return {
    _isHydrated: initilData?._isHydrated || false,
    selectedDate: initilData?.selectedDate || new Date(),
    calendarView: initilData?.calendarView || "week",
    activeSidebar: initilData?.activeSidebar || "main",
  };
};

export const defaultInitState: CalendarState = initCalendarStore();

export const createCalendarStore = (
  initState: CalendarState = defaultInitState,
  skipHydration = false,
) => {
  return createStore<CalendarStore>()(
    persist(
      (set, get) => ({
        ...initState,
        _setHydrated: () => set({ _isHydrated: true }),
        selectDate: (selectedDate: Date) => {
          updateURL({ calendarView: get().calendarView, selectedDate });
          return set(() => {
            return { selectedDate };
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
          return set(() => {
            return { selectedDate: today };
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
            `/calendar/session/create?${params.toString()}`,
          );

          get().setActiveSidebar("edit-session");
        },
      }),
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
