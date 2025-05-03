import type { z } from "zod";
import type { FeedbackQuestion } from "../components/question-list-item";
import type { CreateSurveySchema } from "../lib/surveys.schema";

export type SurveyFormData = Partial<z.infer<typeof CreateSurveySchema>>;

export type SurveyQuestion = FeedbackQuestion & {
  required: boolean;
};

export type CreateSurveyFormState = {
  // Current step
  currentStep: number;
  totalSteps: number;

  // Form data
  surveyInfo: SurveyFormData;
  questions: SurveyQuestion[];

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
};
