import type {
  CalendarView,
  LayoutOccurrence,
  UIOccurrence,
} from "@/components/portal/calendar/calendar.types";
import { getDayKeyFromDateString } from "@/components/portal/calendar/utils";
import type { Event } from "@/db/schema";
import { groupOverlappingOccurrences } from "@/lib/group-overlapping-occurrences";
import { Temporal } from "@js-temporal/polyfill";
import { enableMapSet } from "immer";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { createStore } from "zustand/vanilla";
import { superjsonStorage } from "../superjson-storage";
import type {
  CalendarState,
  CalendarStore,
  InitialCalendarStateData,
} from "./calendar-store.types";
import {
  computeUIOccurrence,
  getDatesForCalendarView,
  updateURL,
} from "./utils";

export const initCalendarStore = (
  initilData?: InitialCalendarStateData,
): CalendarState => {
  const occurrencesMap = new Map(
    initilData?.occurrences?.map((occ) => [occ.id, occ]),
  );
  const eventsMap = new Map<number, Event>(
    initilData?.events?.map((event) => [event.id, event]),
  );

  const initialSelectedDate = initilData?.selectedDate
    ? Temporal.PlainDate.from(initilData?.selectedDate)
    : Temporal.Now.plainDateISO();

  const calendarView = initilData?.calendarView || "week";
  const visibleDates = getDatesForCalendarView(
    initialSelectedDate,
    calendarView,
  );

  return {
    //Internal
    _isHydrated: initilData?._isHydrated || false,

    hubs: initilData?.hubs || [],
    selectedDate: initialSelectedDate,
    visibleDates,
    calendarView,

    //Original Maps
    events: eventsMap,
    occurrences: occurrencesMap,

    //Cached fields
    cachedLayoutOccurrences: new Map<string, LayoutOccurrence[]>(),
    cachedUIOccurrences: new Map<number, UIOccurrence>(),
  };
};

enableMapSet();

export const createCalendarStore = (
  initState: CalendarState,
  skipHydration = false,
) => {
  return createStore<CalendarStore>()(
    devtools(
      persist(
        immer((set, get) => ({
          ...initState,
          _setHydrated: () => set({ _isHydrated: true }),
          selectDate: (date) => {
            const { visibleDates } = get();
            let newVisibleDates = undefined;
            if (!visibleDates.includes(date)) {
              newVisibleDates = getDatesForCalendarView(
                date,
                get().calendarView,
              );
            }
            updateURL({ calendarView: get().calendarView, selectedDate: date });
            set(
              (state) => {
                state.selectedDate = date;
              },
              undefined,
              "selectDate",
            );
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
            set(
              (state) => {
                state.calendarView = calendarView;
              },
              undefined,
              "setCalendarView",
            );
            setVisibleDates(visibleDates);
          },
          setVisibleDates: (dates) => {
            set(
              (state) => {
                state.visibleDates = dates;
              },
              undefined,
              "setVisibleDates",
            );
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

            set(
              (state) => {
                state.selectedDate = newSelectedDate;
                state.visibleDates = newVisibleDates;
              },
              undefined,
              "onNavigation",
            );
          },

          onToday: () => {
            let newVisibleDates = undefined;
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

            set(
              (state) => {
                state.selectedDate = today;
              },
              undefined,
              "onToday",
            );

            if (newVisibleDates) {
              get().setVisibleDates(newVisibleDates);
            }
          },

          // setEdittedOccurrenceId: (id) => {
          //   set((state) => {
          //     state.editedOccurrenceId = id;
          //   });
          // },
          // onToday: () => {
          //   const today = Temporal.Now.plainDateISO();
          //   updateURL({
          //     calendarView: get().calendarView,
          //     selectedDate: today,
          //   });
          //   set((state) => {
          //     state.selectedDate = today;
          //   });
          // },
          // onNavigation: (n: number) => {
          //   const calendarView = get().calendarView;
          //   const selectedDate = get().selectedDate;

          //   const navigationDate = selectedDate.add({
          //     ...(calendarView === "day" && { weeks: n }),
          //     ...(calendarView === "agenda" && { days: n }),
          //     ...(calendarView === "weekday" && { weeks: n }),
          //     ...(calendarView === "week" && { weeks: n }),
          //     ...(calendarView === "month" && { months: n }),
          //   });

          //   updateURL({
          //     calendarView: get().calendarView,
          //     selectedDate: navigationDate,
          //   });
          //   return set(() => {
          //     return { selectedDate: navigationDate };
          //   });
          // },

          // --------------------- NEWWWWW ---------------------
          addEvents: (events) => {
            const eventsToAdd = Array.isArray(events) ? events : [events];
            const eventIds = eventsToAdd.map((e) => e.id).join(",");
            set(
              (state) => {
                eventsToAdd.forEach((event) => {
                  state.events.set(event.id, event);
                });
              },
              undefined,
              `addEvents-${eventIds}`,
            );
          },

          addOccurrences: (occurrences) => {
            const occs = Array.isArray(occurrences)
              ? occurrences
              : [occurrences];

            const occsIds = occs.map((o) => o.id).join(",");

            set(
              (state) => {
                occs.forEach((occ) => {
                  state.occurrences.set(occ.id, occ);
                });
              },
              undefined,
              `addOccurrences-${occsIds}`,
            );
          },

          // addDraftOccurrence: (draftOccurrence) => {
          //   const { addOccurrences } = get();
          //   console.time("setState");
          //   set((state) => {
          //     state.editedOccurrenceId = -1;
          //   });
          //   console.timeEnd("setState");
          //   addOccurrences(draftOccurrence);

          //   const overrides = generateOccurrenceOverrides(draftOccurrence);
          //   windowPushHistory(`/calendar/event/create?${overrides}`);
          // },

          updateEvents: (events, options) => {
            const eventsToUpdate = Array.isArray(events) ? events : [events];
            const eventsToUpdateIds = eventsToUpdate.map((e) => e.id).join(",");
            set(
              (state) => {
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
              },
              undefined,
              `updateEvents-${eventsToUpdateIds}`,
            );
          },

          updateOccurrences: (occurrences, options) => {
            const occurrencesToUpdate = Array.isArray(occurrences)
              ? occurrences
              : [occurrences];

            const occurrencesToUpdateIds = occurrencesToUpdate
              .map((o) => o.id)
              .join(",");

            set(
              (state) => {
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
              },
              undefined,
              `updateOccurrences-${occurrencesToUpdateIds}`,
            );
          },

          removeEvents: (ids, options) => {
            const idsToDelete = Array.isArray(ids) ? ids : [ids];
            const eventsToDeleteIds = idsToDelete.join(",");
            set(
              (state) => {
                idsToDelete.forEach((id) => {
                  if (!state.events.has(id)) {
                    if (options?.silent) return;
                    throw new Error(`Cannot delete non-existent event: ${id}`);
                  }
                  state.events.delete(id);
                });
              },
              undefined,
              `removeEvents-${eventsToDeleteIds}`,
            );
          },
          removeOccurrences: (ids) => {
            const idsToRemove = Array.isArray(ids) ? ids : [ids];
            const occurrencesToDeleteIds = idsToRemove.join(",");

            set(
              (state) => {
                idsToRemove.forEach((id) => {
                  const occ = state.occurrences.get(id);
                  if (!occ) return;

                  // Update state
                  state.occurrences.delete(id);
                  state.cachedUIOccurrences.delete(id);
                });
              },
              undefined,
              `removeOccurrences-${occurrencesToDeleteIds}`,
            );
          },

          getUIOccurrence: (id) => {
            const cachedValue = get().cachedUIOccurrences.get(id);
            if (cachedValue) {
              return cachedValue;
            }

            const occurrence = get().occurrences.get(id);
            if (!occurrence) return null;
            const event = get().events.get(occurrence.eventId);
            if (!event) return null;

            const uiOccurrence = computeUIOccurrence(occurrence, event);

            return uiOccurrence;
          },

          cacheUIOccurrence: (id, occurrence) => {
            const existing = get().cachedUIOccurrences.get(id);
            // Only update if needed
            if (!existing) {
              set(
                (state) => {
                  state.cachedUIOccurrences.set(id, occurrence);
                },
                undefined,
                `cacheUIOccurrence-${id}`,
              );
            }
          },

          getLayoutOccurrences: (dayKey) => {
            // Check cache first
            const cachedValue = get().cachedLayoutOccurrences.get(dayKey);
            if (cachedValue) {
              return cachedValue;
            }

            // If not in cache, calculate but DON'T update state during render
            const occurrencesForDay = Array.from(
              get().occurrences.values(),
            ).filter((occurrence) => {
              const event = get().events.get(occurrence.eventId);
              if (!event) return false;
              const occDayKey = getDayKeyFromDateString(occurrence.startTime);
              return dayKey === occDayKey;
            });

            // Memoize the result to avoid recalculation
            const layoutOccurrences =
              groupOverlappingOccurrences(occurrencesForDay);

            // Return the calculated value without updating state
            return layoutOccurrences;
          },

          // Use this method to update the cache outside of render
          updateLayoutCache: (dayKey, layoutOccurrences) => {
            const existing = get().cachedLayoutOccurrences.get(dayKey);
            // Only update if needed
            if (!existing || existing.length !== layoutOccurrences.length) {
              set(
                (state) => {
                  state.cachedLayoutOccurrences.set(dayKey, layoutOccurrences);
                },
                undefined,
                `updateLayoutCache-${dayKey}`,
              );
            }
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
    ),
  );
};
