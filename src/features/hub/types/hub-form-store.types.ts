import type { HubInfoValues } from "../lib/schemas";

// Types for each step's additional data
export type StudentData = {
  id: number;
  name: string;
  email: string;
  image?: string | null;
};

export type SessionData = {
  id: number;
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
  hubInfo: Partial<HubInfoValues>;
  students: StudentData[];
  sessions: SessionData[];

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Data setters
  setHubInfo: (data: Partial<HubInfoValues>) => void;
  addStudent: (student: StudentData) => void;
  removeStudent: (studentId: number) => void;
  updateStudent: (studentId: number, data: Partial<StudentData>) => void;
  addSession: (session: SessionData) => void;
  removeSession: (sessionId: number) => void;
  updateSession: (sessionId: number, data: Partial<SessionData>) => void;

  // Reset
  reset: () => void;
};
