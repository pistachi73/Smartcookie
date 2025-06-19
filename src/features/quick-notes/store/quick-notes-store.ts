import { superjsonStorage } from "@/core/stores/superjson-storage";
import { enableMapSet } from "immer";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";
import type {
  InitialQuickNotesStateData,
  QuickNotesState,
  QuickNotesStore,
} from "../types/quick-notes-store.types";

export const initQuickNotesStore = (
  initilData?: InitialQuickNotesStateData,
): QuickNotesState => {
  return {
    visibleHubs: new Set(initilData?.visibleHubs || []),
    isHydrated: false,
    edittingHub: null,
    isFilterPanelOpen: false,
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

        toggleAllHubsVisibility: (hubIds: number[]) => {
          set((state) => {
            const allVisible = hubIds.every((id) => state.visibleHubs.has(id));

            if (allVisible) {
              // If all provided hubs are visible, hide them
              hubIds.forEach((id) => state.visibleHubs.delete(id));
            } else {
              // If not all are visible, show all provided hubs
              hubIds.forEach((id) => state.visibleHubs.add(id));
            }
          });
        },

        setEdittingHub: (hubId) => {
          set((state) => {
            state.edittingHub = hubId;
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
        partialize: ({ edittingHub, isHydrated, ...rest }) => ({
          ...rest,
        }),
        merge(persistedState, currentState) {
          const visibleHubs = new Set([
            ...currentState.visibleHubs,
            ...((persistedState as any).visibleHubs || []),
          ]);

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
