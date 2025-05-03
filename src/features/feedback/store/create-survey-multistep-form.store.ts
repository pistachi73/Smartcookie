import { create } from "zustand";
import type { CreateSurveyFormState } from "../types/create-survey-multistep-form.types";

export const useCreateSurveyFormStore = create<CreateSurveyFormState>(
  (set) => ({
    // Initial state
    currentStep: 1,
    totalSteps: 3,

    surveyInfo: {
      title: "",
      description: "",
    },
    questions: [],

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
    setFormData: (data) =>
      set((state) => ({
        surveyInfo: { ...state.surveyInfo, ...data },
      })),

    // Questions management
    addQuestion: (question) =>
      set((state) => {
        // Check if question already exists
        if (state.questions.some((q) => q.id === question.id)) {
          return state;
        }

        const newOrderedQuestions = [
          ...state.questions,
          { ...question, required: true },
        ];

        return {
          questions: newOrderedQuestions,
        };
      }),

    removeQuestion: (questionId) =>
      set((state) => {
        // Filter out the question to remove
        const filteredQuestions = state.questions.filter(
          (q) => q.id !== questionId,
        );

        return {
          questions: filteredQuestions,
        };
      }),

    reorderQuestions: (orderedQuestions) =>
      set((state) => {
        return {
          questions: orderedQuestions,
        };
      }),

    updateQuestionSetting: (questionId, settings) =>
      set((state) => ({
        questions: state.questions.map((q) =>
          q.id === questionId ? { ...q, ...settings } : q,
        ),
      })),

    // Reset
    reset: () =>
      set({
        currentStep: 1,
        surveyInfo: {
          title: "",
          description: "",
          questions: [],
        },
        questions: [],
      }),
  }),
);
