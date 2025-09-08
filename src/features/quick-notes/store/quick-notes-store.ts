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
    visibleHubs: initilData?.visibleHubs || [],
    edittingHub: null,
    isFilterPanelOpen: false,
  };
};

export const VISIBLE_HUBS_COOKIE_NAME = "quick-notesvisible-hubs";
const VISIBLE_HUBS_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const createQuickNotesStore = (initState: QuickNotesState) => {
  return createStore<QuickNotesStore>()(
    immer((set) => ({
      ...initState,

      toggleHubVisibility: (hubId: number) => {
        set((state) => {
          let newVisibleHubs: number[];
          if (state.visibleHubs.includes(hubId)) {
            newVisibleHubs = state.visibleHubs.filter((id) => id !== hubId);
          } else {
            newVisibleHubs = [...state.visibleHubs, hubId];
          }
          state.visibleHubs = newVisibleHubs;

          if (document) {
            document.cookie = `${VISIBLE_HUBS_COOKIE_NAME}=${newVisibleHubs.join(",")}; path=/; max-age=${VISIBLE_HUBS_COOKIE_MAX_AGE}`;
          }
        });
      },

      toggleAllHubsVisibility: (hubIds: number[]) => {
        set((state) => {
          const allVisible = hubIds.every((id) =>
            state.visibleHubs.includes(id),
          );

          if (allVisible) {
            state.visibleHubs = state.visibleHubs.filter(
              (id) => !hubIds.includes(id),
            );
          } else {
            const newHubIds = hubIds.filter(
              (id) => !state.visibleHubs.includes(id),
            );
            state.visibleHubs = [...state.visibleHubs, ...newHubIds];
          }
        });
      },

      setEdittingHub: (hubId) => {
        set((state) => {
          state.edittingHub = hubId;
        });
      },
    })),
  );
};
