import { getEventOccurrenceDayKey } from "@/components/portal/calendar/utils";
import type { Event, EventOccurrence, Hub, Occurrence } from "@/db/schema";
import {
  GroupedOccurrence_,
  _groupOccurrencesByDayAndTime,
  groupEventOccurrencesByDayAndTime,
  sweepLineGroupOverlappingOccurrences,
} from "@/lib/group-overlapping-occurrences";
import { getLocalTimeZone } from "@internationalized/date";
import { addDays, addMonths, addWeeks } from "date-fns";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";
import { superjsonStorage } from "./superjson-storage";

export type CalendarView = "day" | "weekday" | "week" | "month" | "agenda";
export type SidebarType = "main" | "edit-session";
export type DraftEventOccurrence = Partial<EventOccurrence> & {
  eventOccurrenceId: number;
  startTime: Date;
  endTime: Date;
  timezone: string;
};

export type CalendarEventOccurrence = EventOccurrence & { isDraft: false };
export type CalendarDraftEventOccurrence = DraftEventOccurrence & {
  isDraft: true;
};

export type CalendarState = {
  _isHydrated: boolean;
  activeSidebar: SidebarType;
  selectedDate: Date;
  calendarView: CalendarView;

  hubs: Hub[];
  eventOccurrences: Record<string, CalendarEventOccurrence>;
  groupedEventOccurrences: ReturnType<typeof groupEventOccurrencesByDayAndTime>;
  editingEventOccurrenceId?: number;
  draftEventOccurrence: CalendarDraftEventOccurrence;

  // New Stuff
  events: Record<number, Event>;
  occurrences: Record<number, Occurrence>;
  groupedOccurrences: ReturnType<typeof _groupOccurrencesByDayAndTime>;

  // groupedOccurrences:
  // calendarOccurrences: Record<number, CalendarEventOccurrence>;
};

export type CalendarActions = {
  _setHydrated: () => void;
  selectDate: (date: Date) => void;
  setCalendarView: (calendarView: CalendarView) => void;
  setActiveSidebar: (sidebar: SidebarType) => void;
  onNavigation: (n: number) => void;
  onToday: () => void;
  regenerateGroupedEventOccurrencesForDay: (dayKey: string[]) => void;
  createDraftEvent: (startDate: Date, endDate: Date) => void;
  setDraftEventOccurrence: (
    eventOccurrence: Partial<CalendarDraftEventOccurrence>,
  ) => void;
  clearDraftEventOccurrence: () => void;
  clearEditingEventOccurrence: () => void;
  openEditEventOccurrence: (eventOccurrenceId: number) => void;
  addEventOccurrences: (eventOccurrence: CalendarEventOccurrence[]) => void;
  updateOccurrences: (occurrences: CalendarEventOccurrence[]) => void;
  removeEventOccurreces: (eventOccurrencesIds: number[]) => void;

  // New Stuff
  getMergedOccurrence: (occurrenceId: number) => CalendarEventOccurrence | null;
  getMergedGroupedOccurrences: (
    occurrence: GroupedOccurrence_,
  ) => CalendarEventOccurrence | null;
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
    draftEventOccurrence: {} as CalendarDraftEventOccurrence,
    events: initilData?.events || {},
    occurrences: initilData?.occurrences || {},
    groupedOccurrences: _groupOccurrencesByDayAndTime(
      initilData?.occurrences ? Object.values(initilData?.occurrences) : [],
    ),
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

        createDraftEvent: (startDate: Date, endDate: Date) => {
          console.log("createDraftEvent");
          const timezone = getLocalTimeZone();
          const overrides = [
            startDate.toString(),
            endDate.toString(),
            timezone,
          ];
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

          const newDraftEventOccurrence: CalendarDraftEventOccurrence = {
            title: "",
            eventOccurrenceId: -1,
            startTime: startDate,
            endTime: endDate,
            timezone,
            isDraft: true,
          };

          get().setDraftEventOccurrence(newDraftEventOccurrence);
          get().setActiveSidebar("edit-session");
          set((state) => {
            state.editingEventOccurrenceId = -1;
          });
        },

        setDraftEventOccurrence: (
          draftEventOccurrence: Partial<DraftEventOccurrence>,
        ) => {
          console.log(draftEventOccurrence);
          const prevDraftOccurrence = get().draftEventOccurrence;

          const newDraftEventOccurrence = {
            ...prevDraftOccurrence,
            ...draftEventOccurrence,
          };

          console.log(newDraftEventOccurrence);
          set((state) => {
            state.draftEventOccurrence = newDraftEventOccurrence;
          });

          if (
            !(
              "date" in draftEventOccurrence ||
              "startTime" in draftEventOccurrence ||
              "endTime" in draftEventOccurrence
            )
          ) {
            return;
          }

          console.log("update time");

          const dayKeys = new Set<string>([
            getEventOccurrenceDayKey(prevDraftOccurrence.startTime),
            getEventOccurrenceDayKey(newDraftEventOccurrence.startTime),
          ]);

          get().regenerateGroupedEventOccurrencesForDay(Array.from(dayKeys));
        },

        clearDraftEventOccurrence: () => {
          console.log("clearDraftEventOccurrence");
          const draftEventOccurrence = get().draftEventOccurrence;
          if (!draftEventOccurrence) return;

          set((state) => {
            state.draftEventOccurrence = {} as CalendarDraftEventOccurrence;
          });

          get().regenerateGroupedEventOccurrencesForDay([
            getEventOccurrenceDayKey(draftEventOccurrence.startTime),
          ]);
        },
        regenerateGroupedEventOccurrencesForDay: (dayKeys: string[]) => {
          console.log({ dayKeys });
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

        clearEditingEventOccurrence: () => {
          set((state) => {
            state.editingEventOccurrenceId = undefined;
          });
        },
        openEditEventOccurrence: (eventOccurrenceId: number) => {
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
        addEventOccurrences: (eventOccurrences) => {
          console.log("addEventOccurrences");
          const dayKeys = new Set<string>(
            eventOccurrences.map((occurrence) =>
              getEventOccurrenceDayKey(occurrence.startTime),
            ),
          );

          set((state) => {
            eventOccurrences.forEach((eventOccurrence) => {
              state.eventOccurrences[eventOccurrence.eventOccurrenceId] =
                eventOccurrence;
            });
          });

          get().regenerateGroupedEventOccurrencesForDay(Array.from(dayKeys));
        },
        removeEventOccurreces: (eventOccurrenceIds) => {
          console.log("removeEventOccurreces");
          const eventOccurrences = get().eventOccurrences;
          const dayKeys = new Set<string>(
            eventOccurrenceIds
              .map((id) => {
                const occurrence = eventOccurrences[id];
                if (!occurrence) return undefined;
                return getEventOccurrenceDayKey(occurrence.startTime);
              })
              .filter(Boolean) as string[],
          );

          set((state) => {
            eventOccurrenceIds.forEach((id) => {
              delete state.eventOccurrences[id];
            });
          });

          get().regenerateGroupedEventOccurrencesForDay(Array.from(dayKeys));
        },

        updateOccurrences: (updatedOccurrences) => {
          const dayKeys = new Set<string>();

          set((state) => {
            updatedOccurrences.forEach((updatedOccurrence) => {
              dayKeys.add(
                getEventOccurrenceDayKey(updatedOccurrence.startTime),
              );

              state.eventOccurrences[updatedOccurrence.eventOccurrenceId] =
                updatedOccurrence;
            });
          });

          console.log("dayKeys", dayKeys, updatedOccurrences);

          get().regenerateGroupedEventOccurrencesForDay(Array.from(dayKeys));
        },
        getMergedOccurrence: (occurrenceId) => {
          const { events, occurrences } = get();
          const occurrence = occurrences[occurrenceId];
          if (!occurrence) return null;

          const event = events[occurrence?.eventId];
          if (!event) return null;

          const mergedOccurrence: CalendarEventOccurrence = {
            ...event,
            eventId: event.id,
            eventOccurrenceId: occurrence.id,
            startTime: new Date(`${occurrence.startTime}Z`),
            endTime: new Date(`${occurrence.endTime}Z`),
            title: occurrence.overrides?.title || event.title,
            description: occurrence.overrides?.description || event.description,
            timezone: occurrence.overrides?.timezone || event.timezone,
            price: occurrence.overrides?.price || event.price,
            color: occurrence.overrides?.color || event.color,
            isDraft: false,
          };

          return mergedOccurrence;
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
  weekday: addWeeks,
  week: addWeeks,
  month: addMonths,
  agenda: addDays,
};

// const mergeEventsAndOccurrences = ({
//   events,
//   occurrences,
//   byOccurrenceIds,
// }: {
//   events: Record<number, Event>;
//   occurrences: Record<number, DBEventOccurence>;
//   byOccurrenceIds?: number[];
// }) => {
//   const calendarEventsMap = new Map<number, CalendarEventOccurrence>();

//   if (byOccurrenceIds?.length) {
//     byOccurrenceIds.forEach((occurrenceId) => {
//       const occurrence = occurrences[occurrenceId];
//       if (!occurrence) return;

//       const event = events[occurrence.eventId];
//       if (!event) return;

//       calendarEventsMap.set(
//         occurrence.id,
//         getMergedOccurrence({ event, occurrence }),
//       );
//     });
//   } else {
//     Object.values(occurrences).forEach((occurrence) => {
//       const event = events[occurrence.eventId];
//       if (!event) return;

//       calendarEventsMap.set(
//         occurrence.id,
//         getMergedOccurrence({ event, occurrence }),
//       );
//     });
//   }

//   return Object.fromEntries(calendarEventsMap.entries());
// };

// const getMergedOccurrence = ({
//   event,
//   occurrence,
// }: {
//   event: Event;
//   occurrence: DBEventOccurence;
// }): CalendarEventOccurrence => {
//   return {
//     ...event,
//     eventId: event.id,
//     eventOccurrenceId: occurrence.id,
//     startTime: new Date(`${occurrence.startTime}Z`),
//     endTime: new Date(`${occurrence.endTime}Z`),
//     title: occurrence.overrides?.title || event.title,
//     description: occurrence.overrides?.description || event.description,
//     timezone: occurrence.overrides?.timezone || event.timezone,
//     price: occurrence.overrides?.price || event.price,
//     color: occurrence.overrides?.color || event.color,
//     isDraft: false,
//   };
// };
