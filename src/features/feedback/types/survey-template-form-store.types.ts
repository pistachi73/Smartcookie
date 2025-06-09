import type { CreateSurveyTemplateSchema } from "@/data-access/survey-templates/schemas";
import type { z } from "zod";
import type { FeedbackQuestion } from "../components/questions/question-list-item";

export type SurveyFormData = Partial<
  Omit<z.infer<typeof CreateSurveyTemplateSchema>, "questions">
> & {
  id?: number;
};

export type SurveyQuestion = FeedbackQuestion & {
  required: boolean;
  order: number;
  surveyTemplateQuestionId?: number; // For edit mode
};

export type SurveyTemplateFormMode = "create" | "edit";
export type SurveyTemplateQuestionChange = {
  type: "move_up" | "move_down" | "settings_changed";
  message: string;
};
export type SurveyTemplateFormState = {
  // Current step
  currentStep: number;
  totalSteps: number;
  mode: SurveyTemplateFormMode;

  // Form data
  surveyInfo: SurveyFormData;
  questions: SurveyQuestion[];
  originalQuestions: SurveyQuestion[]; // For tracking changes in edit mode

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Data setters
  setFormData: (data: Partial<SurveyFormData>) => void;

  // Questions management
  addQuestion: (question: FeedbackQuestion) => void;
  removeQuestion: (questionId: number) => void;
  reorderQuestions: (orderedQuestions: SurveyQuestion[]) => void;
  updateQuestionSetting: (
    questionId: number,
    settings: Partial<Omit<SurveyQuestion, "id">>,
  ) => void;

  // Reset
  reset: () => void;

  // Edit mode specific
  initializeForEdit: (surveyData: {
    id: number;
    title: string;
    description?: string;
    questions: SurveyQuestion[];
  }) => void;

  // Get changes for edit mode
  getChanges: () => {
    added: SurveyQuestion[];
    removed: number[]; // question IDs
    updated: (SurveyQuestion & {
      changes: Array<SurveyTemplateQuestionChange>;
    })[];
    reordered: boolean;
  };
};
