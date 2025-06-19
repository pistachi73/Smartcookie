export type QuickNotesStore = QuickNotesState & QuickNotesActions;

export type QuickNotesState = {
  isHydrated: boolean;
  edittingHub: number | null;
  visibleHubs: Set<number>;
  isFilterPanelOpen: boolean;
};

export type QuickNotesActions = {
  setHydrated: () => void;

  // Hub visibilit
  toggleHubVisibility: (hubId: number) => void;
  toggleAllHubsVisibility: (hubIds: number[]) => void;
  setEdittingHub: (hubId: number | null) => void;
};

export type InitialQuickNotesStateData = {
  visibleHubs?: number[];
};
