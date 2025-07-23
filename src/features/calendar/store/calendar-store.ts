import { Temporal } from "temporal-polyfill";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";

import { superjsonStorage } from "@/core/stores/superjson-storage";
import type { CalendarView } from "@/features/calendar/types/calendar.types";
import type {
  CalendarState,
  CalendarStore,
  InitialCalendarStateData,
} from "../types/calendar-store.types";
import { getDatesForCalendarView, updateURL } from "./utils";

export const initCalendarStore = (
  initilData?: InitialCalendarStateData,
): CalendarState => {
  const initialSelectedDate = initilData?.selectedDate
    ? Temporal.PlainDate.from(initilData?.selectedDate)
    : Temporal.Now.plainDateISO();

  const calendarView = initilData?.calendarView || "week";
  const visibleDates = getDatesForCalendarView(
    initialSelectedDate,
    calendarView,
  );

  const initState = {
    //Internal
    _isHydrated: initilData?._isHydrated || false,

    sidebarOpen: initilData?.sidebarOpen || true,
    selectedDate: initialSelectedDate,
    visibleDates,
    calendarView,

    isCreateSessionModalOpen: false,
    createSessionFormData: null,
  };

  return initState;
};

export const createCalendarStore = (
  initState: CalendarState,
  skipHydration = false,
) => {
  return createStore<CalendarStore>()(
    persist(
      immer((set, get) => ({
        ...initState,
        _setHydrated: () => set({ _isHydrated: true }),
        toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
        setIsCreateSessionModalOpen: (open) =>
          set({ isCreateSessionModalOpen: open }),
        setCreateSessionFormData: (values) => {
          set((state) => {
            state.createSessionFormData = values;
          });
        },

        selectDate: (date) => {
          const { visibleDates } = get();
          let newVisibleDates: Temporal.PlainDate[] | undefined;
          if (!visibleDates.includes(date)) {
            newVisibleDates = getDatesForCalendarView(date, get().calendarView);
          }
          updateURL({ calendarView: get().calendarView, selectedDate: date });
          set((state) => {
            state.selectedDate = date;
          });
          if (newVisibleDates) {
            get().setVisibleDates(newVisibleDates);
          }
        },
        setCalendarView: (calendarView: CalendarView) => {
          const { selectedDate, setVisibleDates } = get();

          const visibleDates = getDatesForCalendarView(
            selectedDate,
            calendarView,
          );

          updateURL({ calendarView, selectedDate: get().selectedDate });
          set((state) => {
            state.calendarView = calendarView;
          });
          setVisibleDates(visibleDates);
        },
        setVisibleDates: (dates) => {
          set((state) => {
            state.visibleDates = dates;
          });
        },

        //NAVIGATION
        onNavigation: (direction) => {
          const { calendarView, selectedDate } = get();
          let adjustment: Temporal.DurationLike;

          switch (calendarView) {
            case "day":
            case "agenda":
              adjustment = { days: direction };
              break;
            case "weekday":
              adjustment = { days: 7 * direction };
              break;
            case "week":
              adjustment = { weeks: direction };
              break;
            case "month":
              adjustment = { months: direction };
              break;
            default:
              adjustment = { days: direction };
          }

          const newSelectedDate = selectedDate.add(adjustment);
          const newVisibleDates = getDatesForCalendarView(
            newSelectedDate,
            calendarView,
          );

          updateURL({
            calendarView,
            selectedDate: newSelectedDate,
          });

          set((state) => {
            state.selectedDate = newSelectedDate;
            state.visibleDates = newVisibleDates;
          });
        },

        onToday: () => {
          let newVisibleDates: Temporal.PlainDate[] | undefined;
          const today = Temporal.Now.plainDateISO();

          if (!get().visibleDates.includes(today)) {
            newVisibleDates = getDatesForCalendarView(
              today,
              get().calendarView,
            );
          }
          updateURL({
            calendarView: get().calendarView,
            selectedDate: today,
          });

          set((state) => {
            state.selectedDate = today;
          });

          if (newVisibleDates) {
            get().setVisibleDates(newVisibleDates);
          }
        },
      })),
      {
        name: "calendar-store",
        storage: superjsonStorage,
        skipHydration,
        partialize: (state) => {
          const { createSessionFormData, isCreateSessionModalOpen, ...rest } =
            state;
          return {
            ...rest,
          };
        },
        onRehydrateStorage: () => {
          return (state, error) => {
            if (!error) state?._setHydrated();
          };
        },
      },
    ),
  );
};
