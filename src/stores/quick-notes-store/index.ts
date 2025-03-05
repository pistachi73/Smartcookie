import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";
import type {
  Hub,
  InitialQuickNotesStateData,
  QuickNotesState,
  QuickNotesStore,
} from "./quick-notes-store.types";

export const initQuickNotesStore = (
  initilData?: InitialQuickNotesStateData,
): QuickNotesState => {
  return {
    visibleHubs: initilData?.hubIds || [],
    isFilterPanelOpen: false,
    hubs: initilData?.hubs || null,
  };
};

export const createQuickNotesStore = (initState: QuickNotesState) => {
  return createStore<QuickNotesStore>()(
    persist(
      immer((set, get) => ({
        ...initState,
        toggleHubVisibility: (hubId: number) => {
          set((state) => {
            state.visibleHubs = state.visibleHubs.includes(hubId)
              ? state.visibleHubs.filter((id) => id !== hubId)
              : [...state.visibleHubs, hubId];
          });
        },

        setVisibleHubs: (hubIds: number[]) => {
          set((state) => {
            state.visibleHubs = hubIds;
          });
        },

        setHubs: (hubs: Hub[]) => {
          set((state) => {
            state.hubs = hubs;
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
      })),
      {
        name: "quick-notes-store",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
};
