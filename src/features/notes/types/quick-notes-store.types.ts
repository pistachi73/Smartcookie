import type { HubSummary } from "./quick-notes.types";

export type QuickNotesStore = QuickNotesState & QuickNotesActions;

export type QuickNotesState = {
  isHydrated: boolean;
  edittingHub: number | null;
  visibleHubs: Set<number>;
  isFilterPanelOpen: boolean;

  hubIds: number[];
};

export type QuickNotesActions = {
  setHydrated: () => void;

  // Hub visibility
  toggleHubVisibility: (hubId: number) => void;
  toggleAllHubsVisibility: () => void;
  setVisibleHubs: (hubIds: Set<number>) => void;
  setEdittingHub: (hubId: number | null) => void;

  // UI actions
  toggleFilterPanel: () => void;
  setFilterPanelOpen: (isOpen: boolean) => void;
};

export type InitialQuickNotesStateData = {
  visibleHubs?: number[];
  hubIds: number[];
  hubs?: HubSummary[];
};
