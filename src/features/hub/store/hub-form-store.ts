import { create } from "zustand";
import { defaultHubInfo } from "../lib/schemas";
import type { HubFormState, StudentData } from "../types/hub-form-store.types";

// Create the store
export const useHubFormStore = create<HubFormState>((set) => ({
  // Initial state
  currentStep: 1,
  totalSteps: 3,

  hubInfo: defaultHubInfo,
  students: [],
  sessions: [],

  // Actions
  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  // Data setters
  setHubInfo: (data) =>
    set((state) => ({
      hubInfo: { ...state.hubInfo, ...data },
    })),

  addStudent: (student) =>
    set((state) => ({
      students: [...state.students, student],
    })),

  removeStudent: (studentId: number) =>
    set((state) => ({
      students: state.students.filter((student) => student.id !== studentId),
    })),

  updateStudent: (studentId: number, data: Partial<StudentData>) =>
    set((state) => ({
      students: state.students.map((student) =>
        student.id === studentId ? { ...student, ...data } : student,
      ),
    })),

  addSessions: (sessions) =>
    set((state) => ({
      sessions: [...state.sessions, ...sessions],
    })),

  removeSession: (sessionIndex: number) =>
    set((state) => ({
      sessions: state.sessions.filter((_, index) => index !== sessionIndex),
    })),

  updateSession: (sessionIndex: number, data) =>
    set((state) => ({
      sessions: state.sessions.map((session, index) =>
        index === sessionIndex ? { ...session, ...data } : session,
      ),
    })),

  // Reset
  reset: () =>
    set({
      currentStep: 1,
      hubInfo: defaultHubInfo,
      students: [],
      sessions: [],
    }),
}));
