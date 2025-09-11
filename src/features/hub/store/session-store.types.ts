export interface SessionState {
  isEditingMode: boolean;
  selectedSessions: { id: number; startTime: string }[];
  sessionToEdit: number | null;

  isDeleteModalOpen: boolean;
  isUpdateModalOpen: boolean;
  isAddModalOpen: boolean;
}

export interface SessionActions {
  setSessionToEdit: (sessionId: number | null) => void;

  toggleSessionSelection: (
    session: { id: number; startTime: string },
    isSelected: boolean,
  ) => void;
  selectAllSessions: (sessions: { id: number; startTime: string }[]) => void;
  clearSelectedSessions: () => void;

  setIsEditingMode: (isEditing: boolean) => void;
  setIsDeleteModalOpen: (open: boolean) => void;
  setIsUpdateModalOpen: (open: boolean) => void;
  setIsAddModalOpen: (open: boolean) => void;
}

export type SessionStore = SessionState & SessionActions;
