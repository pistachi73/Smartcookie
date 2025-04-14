export interface SessionState {
  isEditingMode: boolean;
  selectedSessions: number[];
  sessionToEdit: number | null;

  isDeleteModalOpen: boolean;
  isUpdateModalOpen: boolean;
  isAddModalOpen: boolean;
}

export interface SessionActions {
  setSessionToEdit: (sessionId: number | null) => void;

  toggleSessionSelection: (sessionId: number, isSelected: boolean) => void;
  selectAllSessions: (sessionIds: number[]) => void;
  clearSelectedSessions: () => void;

  setIsEditingMode: (isEditing: boolean) => void;
  setIsDeleteModalOpen: (open: boolean) => void;
  setIsUpdateModalOpen: (open: boolean) => void;
  setIsAddModalOpen: (open: boolean) => void;
}

export type SessionStore = SessionState & SessionActions;
