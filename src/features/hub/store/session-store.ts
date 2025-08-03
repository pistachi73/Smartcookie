import { create } from "zustand";

import type { SessionStore } from "./session-store.types";

export const useSessionStore = create<SessionStore>((set) => ({
  // State
  isEditingMode: false,
  selectedSessions: [],
  sessionToEdit: null,
  hubId: null,

  isDeleteModalOpen: false,
  isUpdateModalOpen: false,
  isAddModalOpen: false,

  // Actions
  setIsEditingMode: (isEditing) =>
    set(() => {
      // Clear selected sessions when toggling off editing mode
      if (!isEditing) {
        return {
          isEditingMode: isEditing,
          selectedSessions: [],
        };
      }
      return { isEditingMode: isEditing };
    }),

  toggleSessionSelection: (sessionId, isSelected) =>
    set((state) => {
      if (isSelected) {
        return {
          selectedSessions: [...state.selectedSessions, sessionId],
        };
      }

      return {
        selectedSessions: state.selectedSessions.filter(
          (id) => id !== sessionId,
        ),
      };
    }),

  selectAllSessions: (sessionIds) =>
    set(() => ({ selectedSessions: sessionIds })),

  clearSelectedSessions: () => set(() => ({ selectedSessions: [] })),

  openSessionModal: (sessionToEdit = null) =>
    set(() => ({
      isModalOpen: true,
      sessionToEdit,
    })),

  closeSessionModal: () =>
    set(() => ({
      isModalOpen: false,
      sessionToEdit: null,
    })),

  setSessionToEdit: (sessionId) => set(() => ({ sessionToEdit: sessionId })),

  setIsDeleteModalOpen: (open) => set(() => ({ isDeleteModalOpen: open })),
  setIsUpdateModalOpen: (open) => set(() => ({ isUpdateModalOpen: open })),
  setIsAddModalOpen: (open) => set(() => ({ isAddModalOpen: open })),
}));
