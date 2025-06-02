import { create } from "zustand";
import type {
  SurveyQuestion,
  SurveyTemplateFormState,
  SurveyTemplateQuestionChange,
} from "../types/survey-template-form-store.types";

export const useSurveyTemplateFormStore = create<SurveyTemplateFormState>(
  (set, get) => ({
    // Initial state
    currentStep: 1,
    totalSteps: 3,
    mode: "create",

    surveyInfo: {
      title: "",
      description: "",
    },
    questions: [],
    originalQuestions: [],

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

        const maxOrder = Math.max(
          0,
          ...state.questions.map((q) => q.order || 0),
        );
        const newQuestion: SurveyQuestion = {
          ...question,
          required: true,
          order: maxOrder + 1,
        };

        return {
          questions: [...state.questions, newQuestion],
        };
      }),

    removeQuestion: (questionId) =>
      set((state) => {
        const filteredQuestions = state.questions.filter(
          (q) => q.id !== questionId,
        );

        // Reorder remaining questions to maintain sequence
        const reorderedQuestions = filteredQuestions.map((q, index) => ({
          ...q,
          order: index + 1,
        }));

        return {
          questions: reorderedQuestions,
        };
      }),

    reorderQuestions: (orderedQuestions) =>
      set(() => {
        // Update order based on array position
        const reorderedQuestions = orderedQuestions.map((q, index) => ({
          ...q,
          order: index + 1,
        }));

        return {
          questions: reorderedQuestions,
        };
      }),

    updateQuestionSetting: (questionId, settings) =>
      set((state) => ({
        questions: state.questions.map((q) =>
          q.id === questionId ? { ...q, ...settings } : q,
        ),
      })),

    // Edit mode specific
    initializeForEdit: (surveyData) =>
      set({
        mode: "edit",
        currentStep: 1,
        surveyInfo: {
          id: surveyData.id,
          title: surveyData.title,
          description: surveyData.description,
        },
        questions: surveyData.questions.map((q, index) => ({
          ...q,
          order: q.order || index + 1,
        })),
        originalQuestions: surveyData.questions.map((q, index) => ({
          ...q,
          order: q.order || index + 1,
        })),
      }),

    // Get changes for edit mode
    getChanges: () => {
      const state = get();
      const { questions, originalQuestions } = state;

      // Find added questions (not in original)
      const added = questions.filter(
        (q) => !originalQuestions.some((oq) => oq.id === q.id),
      );

      // Find removed questions (in original but not in current)
      const removed = originalQuestions
        .filter((oq) => !questions.some((q) => q.id === oq.id))
        .map((q) => q.id);

      // Find updated questions (same ID but different properties)
      const updated = questions
        .map((q) => {
          const original = originalQuestions.find((oq) => oq.id === q.id);
          if (!original) return null;

          const changes: Array<SurveyTemplateQuestionChange> = [];

          if (original.required !== q.required) {
            changes.push({
              type: "settings_changed",
              message: q.required ? "Made required" : "Made optional",
            });
          }

          if (original.order !== q.order) {
            if (q.order < original.order) {
              const positions = original.order - q.order;
              changes.push({
                type: "move_up",
                message: `Moved up ${positions} position${positions > 1 ? "s" : ""}`,
              });
            } else {
              const positions = q.order - original.order;
              changes.push({
                type: "move_down",
                message: `Moved down ${positions} position${positions > 1 ? "s" : ""}`,
              });
            }
          }

          return changes.length > 0 ? { ...q, changes } : null;
        })
        .filter((q): q is NonNullable<typeof q> => q !== null);

      // Check if reordering occurred
      const reordered = questions.some((q, index) => {
        const original = originalQuestions.find((oq) => oq.id === q.id);
        return original && original.order !== index + 1;
      });

      return {
        added,
        removed,
        updated,
        reordered,
      };
    },

    // Reset
    reset: () =>
      set({
        currentStep: 1,
        mode: "create",
        surveyInfo: {
          title: "",
          description: "",
        },
        questions: [],
        originalQuestions: [],
      }),
  }),
);
