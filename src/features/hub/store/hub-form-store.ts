import { create } from "zustand";
import { type HubFormValues, defaultFormData } from "../lib/schemas";

// Types for each step's additional data
export type StudentData = {
  id: number;
  name: string;
  email: string;
  image?: string | null;
};

export type SessionData = {
  id: string;
  title: string;
  date: Date;
  duration: number; // in minutes
  location?: string;
};

export type HubFormState = {
  // Current step
  currentStep: number;
  totalSteps: number;

  // Form data for each step
  hubInfo: HubFormValues;
  students: StudentData[];
  sessions: SessionData[];

  // Track completion status for each step
  stepValidation: {
    hubInfoValid: boolean;
    studentsValid: boolean;
    sessionsValid: boolean;
  };

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Data setters
  setHubInfo: (data: Partial<HubFormValues>) => void;
  addStudent: (student: StudentData) => void;
  removeStudent: (studentId: number) => void;
  updateStudent: (studentId: number, data: Partial<StudentData>) => void;
  addSession: (session: SessionData) => void;
  removeSession: (sessionId: string) => void;
  updateSession: (sessionId: string, data: Partial<SessionData>) => void;

  // Validation
  setStepValidation: (
    step: "hubInfoValid" | "studentsValid" | "sessionsValid",
    isValid: boolean,
  ) => void;

  // Reset
  reset: () => void;
};

// Create the store
export const useHubFormStore = create<HubFormState>((set) => ({
  // Initial state
  currentStep: 1,
  totalSteps: 3,

  hubInfo: defaultFormData,
  students: [],
  sessions: [],

  stepValidation: {
    hubInfoValid: false,
    studentsValid: false,
    sessionsValid: false,
  },

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

  addSession: (session) =>
    set((state) => ({
      sessions: [...state.sessions, session],
    })),

  removeSession: (sessionId) =>
    set((state) => ({
      sessions: state.sessions.filter((session) => session.id !== sessionId),
    })),

  updateSession: (sessionId, data) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId ? { ...session, ...data } : session,
      ),
    })),

  // Validation
  setStepValidation: (step, isValid) =>
    set((state) => ({
      stepValidation: {
        ...state.stepValidation,
        [step]: isValid,
      },
    })),

  // Reset
  reset: () =>
    set({
      currentStep: 1,
      hubInfo: defaultFormData,
      students: [],
      sessions: [],
      stepValidation: {
        hubInfoValid: false,
        studentsValid: false,
        sessionsValid: false,
      },
    }),
}));
