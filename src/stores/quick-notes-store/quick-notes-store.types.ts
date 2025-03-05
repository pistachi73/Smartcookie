import type { Hub as DBHub, QuickNote as DBQuickNote } from "@/db/schema";

// Ensure QuickNote always has an id
export type QuickNote = Pick<
  DBQuickNote,
  "id" | "hubId" | "content" | "updatedAt"
>;
export type Hub = Pick<DBHub, "id" | "name">;

export type QuickNotesStore = QuickNotesState & QuickNotesActions;

export type QuickNotesState = {
  visibleHubs: number[];
  isFilterPanelOpen: boolean;
  hubs: Hub[] | null;
};

export type QuickNotesActions = {
  // Hub visibility
  toggleHubVisibility: (hubId: number) => void;
  setVisibleHubs: (hubIds: number[]) => void;
  setHubs: (hubs: Hub[]) => void;

  // UI actions
  toggleFilterPanel: () => void;
  setFilterPanelOpen: (isOpen: boolean) => void;
};

export type InitialQuickNotesStateData = {
  hubIds: number[];
  hubs?: Hub[];
};
