import { enableMapSet } from "immer";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";
import { superjsonStorage } from "../superjson-storage";
import type {
  InitialQuickNotesStateData,
  QuickNotesState,
  QuickNotesStore,
} from "./quick-notes-store.types";

export const initQuickNotesStore = (
  initilData?: InitialQuickNotesStateData,
): QuickNotesState => {
  console.log({ initilData });
  return {
    visibleHubs: new Set(initilData?.visibleHubs || []),
    isHydrated: false,
    edittingHub: null,
    isFilterPanelOpen: false,
    hubIds: initilData?.hubIds || [],
  };
};

enableMapSet();

export const createQuickNotesStore = (initState: QuickNotesState) => {
  return createStore<QuickNotesStore>()(
    persist(
      immer((set, get) => ({
        ...initState,

        toggleHubVisibility: (hubId: number) => {
          set((state) => {
            if (state.visibleHubs.has(hubId)) {
              state.visibleHubs.delete(hubId);
            } else {
              state.visibleHubs.add(hubId);
            }
          });
        },

        toggleAllHubsVisibility: () => {
          set((state) => {
            const areAllVisible =
              state.hubIds.length === state.visibleHubs.size;
            if (areAllVisible) {
              state.visibleHubs.clear();
            } else {
              state.visibleHubs = new Set([
                ...state.visibleHubs,
                ...state.hubIds,
              ]);
            }
          });
        },

        setEdittingHub: (hubId) => {
          set((state) => {
            state.edittingHub = hubId;
          });
        },

        setVisibleHubs: (hubIds: Set<number>) => {
          set((state) => {
            state.visibleHubs = hubIds;
          });
        },

        toggleFilterPanel: () => {
          set((state) => {
            state.isFilterPanelOpen = !state.isFilterPanelOpen;
          });
        },
        setFilterPanelOpen: (isOpen: boolean) => {
          set((state) => {
            state.isFilterPanelOpen = isOpen;
          });
        },
        setHydrated: () => {
          set((state) => {
            state.isHydrated = true;
          });
        },
      })),
      {
        name: "quick-notes-store",
        storage: superjsonStorage,
        partialize: ({ edittingHub, hubIds, isHydrated, ...rest }) => ({
          ...rest,
        }),
        merge(persistedState, currentState) {
          const visibleHubs = new Set([
            ...currentState.visibleHubs,
            ...((persistedState as any).visibleHubs || []),
          ]);

          console.log({
            persistedState,
            currentState,
            visibleHubs,
          });
          return {
            ...currentState,
            ...(persistedState as any),
            visibleHubs,
          };
        },
        onRehydrateStorage: () => {
          return async (state, error) => {
            if (!error) {
              state?.setHydrated();
            }
          };
        },
      },
    ),
  );
};
