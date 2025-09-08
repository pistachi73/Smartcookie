export type QuickNotesStore = QuickNotesState & QuickNotesActions;

export type QuickNotesState = {
  edittingHub: number | null;
  visibleHubs: number[];
  isFilterPanelOpen: boolean;
};

export type QuickNotesActions = {
  toggleHubVisibility: (hubId: number) => void;
  toggleAllHubsVisibility: (hubIds: number[]) => void;
  setEdittingHub: (hubId: number | null) => void;
};

export type InitialQuickNotesStateData = {
  visibleHubs?: number[];
};
