import type {
  CalendarView,
  DatedOccurrence,
  MergedOccurrence,
  OccurrenceGridPosition,
} from "@/components/portal/calendar/calendar.types";
import {
  generateOccurrenceOverrides,
  getDayKeyFromDate,
} from "@/components/portal/calendar/utils";
import type { Event, Hub, Occurrence } from "@/db/schema";
import { groupOverlappingOccurrences } from "@/lib/group-overlapping-occurrences";
import { Temporal } from "@js-temporal/polyfill";
import { enableMapSet } from "immer";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";
import { superjsonStorage } from "./superjson-storage";

export type CalendarState = {
  _isHydrated: boolean;
  hubs: Hub[];
  selectedDate: Temporal.PlainDate;
  calendarView: CalendarView;

  // New Stuff
  events: Map<number, Event>;
  occurrences: Map<number, DatedOccurrence>;
  dailyOccurrencesIds: Map<string, Set<number>>;
  dailyOccurrencesGridPosition: Map<string, OccurrenceGridPosition[]>;
  editedOccurrenceId?: number;
};

const initiCalendarStoreOccurrences = (occurrences: DatedOccurrence[]) => {
  const groupedByDay = occurrences.reduce<Record<string, DatedOccurrence[]>>(
    (acc, occurrence) => {
      const dayKey = getDayKeyFromDate(occurrence.startTime);
      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }
      acc[dayKey].push(occurrence);
      return acc;
    },
    {},
  );

  const dailyOccurrencesGridPosition = new Map<
    string,
    OccurrenceGridPosition[]
  >();
  const dailyOccurrencesIds = new Map<string, Set<number>>();
  for (const [day, dayOccurrences] of Object.entries(groupedByDay)) {
    dailyOccurrencesIds.set(day, new Set(dayOccurrences.map((occ) => occ.id)));
    dailyOccurrencesGridPosition.set(
      day,
      groupOverlappingOccurrences(dayOccurrences),
    );
  }

  return { dailyOccurrencesGridPosition, dailyOccurrencesIds };
};

export type InitCalendarState = Omit<
  Partial<CalendarState>,
  "occurrences" | "events" | "selectedDate"
> & {
  selectedDate?: string;
  occurrences?: Occurrence[];
  events?: Event[];
};

export type CalendarActions = {
  _setHydrated: () => void;
  selectDate: (date: Temporal.PlainDate) => void;
  setCalendarView: (calendarView: CalendarView) => void;
  setEdittedOccurrenceId: (id?: number) => void;
  onNavigation: (n: number) => void;
  onToday: () => void;

  // New Stuff
  addEvents: (events: Event | Event[]) => void;
  addOccurrences: (occurrences: DatedOccurrence | DatedOccurrence[]) => void;
  updateEvents: (
    events:
      | (Partial<Event> & Pick<Event, "id">)
      | Array<Partial<Event> & Pick<Event, "id">>,
    options?: { silent?: boolean; mergeStrategy?: "shallow" | "deep" },
  ) => void;
  updateOccurrences: (
    occurrences:
      | (Partial<DatedOccurrence> & Pick<DatedOccurrence, "id">)
      | Array<Partial<DatedOccurrence> & Pick<DatedOccurrence, "id">>,
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

  addDraftOccurrence: (occurrence: DatedOccurrence) => void;
  recalculateDailyOccurrences: (dayKeys: string | string[]) => void;
};

export type CalendarStore = CalendarState & CalendarActions;

export const initCalendarStore = (
  initilData?: InitCalendarState,
): CalendarState => {
  const datedOccurrences =
    initilData?.occurrences?.map(toDatedOccurrence) || [];
  const datedOccurrencesMap = new Map<number, DatedOccurrence>(
    datedOccurrences?.map((occurrence) => [occurrence.id, occurrence]),
  );

  const eventsMap = new Map<number, Event>(
    initilData?.events?.map((event) => [event.id, event]),
  );

  const { dailyOccurrencesIds, dailyOccurrencesGridPosition } =
    initiCalendarStoreOccurrences(datedOccurrences);

  const initialSelectedDate = initilData?.selectedDate
    ? Temporal.PlainDate.from(initilData?.selectedDate)
    : Temporal.Now.plainDateISO();

  return {
    _isHydrated: initilData?._isHydrated || false,
    hubs: initilData?.hubs || [],

    selectedDate: initialSelectedDate,
    calendarView: initilData?.calendarView || "week",
    events: eventsMap,
    occurrences: datedOccurrencesMap,
    dailyOccurrencesIds,
    dailyOccurrencesGridPosition,
  };
};

export const defaultInitState: CalendarState = initCalendarStore();

enableMapSet();

export const createCalendarStore = (
  initState: CalendarState = defaultInitState,
  skipHydration = false,
) => {
  return createStore<CalendarStore>()(
    persist(
      immer((set, get) => ({
        ...initState,
        _setHydrated: () => set({ _isHydrated: true }),
        selectDate: (date) => {
          updateURL({ calendarView: get().calendarView, selectedDate: date });
          set((state) => {
            state.selectedDate = date;
          });
        },
        setCalendarView: (calendarView: CalendarView) => {
          updateURL({ calendarView, selectedDate: get().selectedDate });
          set((state) => {
            state.calendarView = calendarView;
          });
        },
        setEdittedOccurrenceId: (id) => {
          set((state) => {
            state.editedOccurrenceId = id;
          });
        },
        onToday: () => {
          const today = Temporal.Now.plainDateISO();
          updateURL({
            calendarView: get().calendarView,
            selectedDate: today,
          });
          set((state) => {
            state.selectedDate = today;
          });
        },
        onNavigation: (n: number) => {
          const calendarView = get().calendarView;
          const selectedDate = get().selectedDate;

          const navigationDate = selectedDate.add({
            ...(calendarView === "day" && { weeks: n }),
            ...(calendarView === "agenda" && { days: n }),
            ...(calendarView === "weekday" && { weeks: n }),
            ...(calendarView === "week" && { weeks: n }),
            ...(calendarView === "month" && { months: n }),
          });

          updateURL({
            calendarView: get().calendarView,
            selectedDate: navigationDate,
          });
          return set(() => {
            return { selectedDate: navigationDate };
          });
        },

        // --------------------- NEWWWWW ---------------------
        addEvents: (events) => {
          const eventsToAdd = Array.isArray(events) ? events : [events];

          set((state) => {
            eventsToAdd.forEach((event) => {
              state.events.set(event.id, event);
            });
          });
        },

        addOccurrences: (occurrences) => {
          const { recalculateDailyOccurrences } = get();
          const dayKeys = new Set<string>();
          const occurrencesToAdd = Array.isArray(occurrences)
            ? occurrences
            : [occurrences];
          set((state) => {
            occurrencesToAdd.forEach((occurrence) => {
              const dayKey = getDayKeyFromDate(occurrence.startTime);
              const dayOccurrencesIds = state.dailyOccurrencesIds.get(dayKey);
              dayKeys.add(dayKey);
              state.occurrences.set(occurrence.id, occurrence);
              state.dailyOccurrencesIds.set(
                dayKey,
                new Set([...(dayOccurrencesIds || []), occurrence.id]),
              );
            });
          });
          recalculateDailyOccurrences(Array.from(dayKeys));
        },

        addDraftOccurrence: (draftOccurrence) => {
          const { addOccurrences } = get();
          console.time("setState");
          set((state) => {
            state.editedOccurrenceId = -1;
          });
          console.timeEnd("setState");
          addOccurrences(draftOccurrence);

          const overrides = generateOccurrenceOverrides(draftOccurrence);
          windowPushHistory(`/calendar/event/create?${overrides}`);
        },

        updateEvents: (events, options) => {
          const eventsToUpdate = Array.isArray(events) ? events : [events];
          set((state) => {
            eventsToUpdate.forEach((update) => {
              const existing = state.events.get(update.id);
              if (!existing) {
                if (options?.silent) return;
                throw new Error(`Event ${update.id} not found`);
              }

              state.events.set(update.id, {
                ...existing,
                ...update,
              });
            });
          });
        },

        updateOccurrences: (occurrences, options) => {
          const occurrencesToUpdate = Array.isArray(occurrences)
            ? occurrences
            : [occurrences];

          set((state) => {
            occurrencesToUpdate.forEach((update) => {
              const existing = state.occurrences.get(update.id);
              if (!existing) {
                if (options?.silent) return;
                throw new Error(`Occurrence ${update.id} not found`);
              }

              state.occurrences.set(update.id, {
                ...existing,
                ...update,
              });
            });
          });
        },

        removeEvents: (ids, options) => {
          const idsToDelete = Array.isArray(ids) ? ids : [ids];
          set((state) => {
            idsToDelete.forEach((id) => {
              if (!state.events.has(id)) {
                if (options?.silent) return;
                throw new Error(`Cannot delete non-existent event: ${id}`);
              }
              state.events.delete(id);
            });
          });
        },
        removeOccurrences: (ids, options) => {
          const { recalculateDailyOccurrences } = get();
          const dayKeys = new Set<string>();
          const idsToDelete = Array.isArray(ids) ? ids : [ids];

          set((state) => {
            idsToDelete.forEach((id) => {
              const occurrence = state.occurrences.get(id);
              if (!occurrence) {
                if (options?.silent) return;
                throw new Error(`Cannot delete non-existent occurrence: ${id}`);
              }
              const dayKey = getDayKeyFromDate(occurrence.startTime);
              const dayOccurrenceIds = state.dailyOccurrencesIds.get(dayKey);

              if (!dayOccurrenceIds) {
                if (options?.silent) return;
                throw new Error(
                  `Cannot delete non-existent occurrence in day occurrences: ${id}`,
                );
              }

              dayKeys.add(dayKey);
              dayOccurrenceIds.delete(id);
              state.occurrences.delete(id);
              state.dailyOccurrencesIds.set(dayKey, dayOccurrenceIds);
            });
          });

          recalculateDailyOccurrences(Array.from(dayKeys));
        },

        recalculateDailyOccurrences: (dayKeys) => {
          const dayKeysToRecalculate = Array.isArray(dayKeys)
            ? dayKeys
            : [dayKeys];

          set((state) => {
            dayKeysToRecalculate.forEach((dayKey) => {
              const dayOccurrenceIds = state.dailyOccurrencesIds.get(dayKey);
              const dayOccurrences: DatedOccurrence[] = [];

              if (!dayOccurrenceIds) return;

              for (const dayOccurrenceId of dayOccurrenceIds) {
                const occurrence = state.occurrences.get(dayOccurrenceId);
                if (!occurrence) continue;
                dayOccurrences.push(occurrence);
              }

              state.dailyOccurrencesGridPosition.set(
                dayKey,
                groupOverlappingOccurrences(dayOccurrences),
              );
            });
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
}: { calendarView: CalendarView; selectedDate: Temporal.PlainDate }) => {
  const [year, month, day] = [
    selectedDate.year,
    selectedDate.month,
    selectedDate.day,
  ];

  window.history.pushState(
    null,
    "",
    `/calendar/${calendarView}/${year}/${month}/${day}/`,
  );
};

const windowPushHistory = (path: string) => {
  if (!window.history.pushState) return;
  window.history.pushState(null, "", path);
};

const toDatedOccurrence = (occurrence: Occurrence): DatedOccurrence => ({
  ...occurrence,
  startTime: Temporal.ZonedDateTime.from(occurrence.startTime),
  endTime: Temporal.ZonedDateTime.from(occurrence.endTime),
});

export const mergeEventAndOccurrence = ({
  event,
  occurrence,
}: {
  event: Event;
  occurrence: DatedOccurrence;
}): MergedOccurrence => {
  return {
    ...event,
    eventId: event.id,
    occurrenceId: occurrence.id,
    startTime: occurrence.startTime,
    endTime: occurrence.endTime,
    title: occurrence.overrides?.title || event.title,
    description: occurrence.overrides?.description || event.description,
    timezone: occurrence.overrides?.timezone || event.timezone,
    price: occurrence.overrides?.price || event.price,
    color: occurrence.overrides?.color || event.color,
  };
};
