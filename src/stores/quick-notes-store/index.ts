import { enableMapSet } from "immer";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";
import { superjsonStorage } from "../superjson-storage";
import type {
  Hub,
  InitialQuickNotesStateData,
  QuickNotesState,
  QuickNotesStore,
} from "./quick-notes-store.types";

export const initQuickNotesStore = (
  initilData?: InitialQuickNotesStateData,
): QuickNotesState => {
  const hubsMap = new Map<number, Hub>(
    initilData?.hubs?.map((hub) => [hub.id || 0, hub]),
  );

  return {
    visibleHubs: new Set(),
    isHydrated: false,
    edittingHub: null,
    isFilterPanelOpen: false,
    hubsMap,
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
            const areAllVisible = state.hubsMap.size === state.visibleHubs.size;
            if (areAllVisible) {
              state.visibleHubs.clear();
            } else {
              const allHubIds = Array.from(state.hubsMap.keys());
              state.visibleHubs = new Set(allHubIds);
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
        partialize: ({ edittingHub, ...rest }) => ({
          ...rest,
        }),
        onRehydrateStorage: () => {
          return (state, error) => {
            if (!error) {
              state?.setHydrated();
            }
          };
        },
      },
    ),
  );
};
