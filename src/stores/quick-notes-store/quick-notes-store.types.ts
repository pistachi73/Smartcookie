import type { Hub as DBHub, QuickNote as DBQuickNote } from "@/db/schema";

// Ensure QuickNote always has an id
export type QuickNote = Pick<
  DBQuickNote,
  "id" | "hubId" | "content" | "updatedAt"
>;
export type Hub = Pick<DBHub, "name" | "id">;

export type QuickNotesStore = QuickNotesState & QuickNotesActions;

export type QuickNotesState = {
  isHydrated: boolean;
  edittingHub: number | null;
  visibleHubs: Set<number>;
  isFilterPanelOpen: boolean;

  hubsMap: Map<number, Hub>;
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
  hubIds: number[];
  hubs?: Hub[];
};
