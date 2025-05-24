import { superjsonStorage } from "@/core/stores/superjson-storage";
import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

type SurveyResponseData = {
  id?: number;
  studentId?: number;
  email?: string;
};

export interface SurveyStoreState {
  _isHydrated: boolean;
  step: number;
  totalSteps: number;
  totalQuestions: number;
  responses: Record<number, string>;
  direction: 1 | -1;
  surveyResponseData: SurveyResponseData;
  isTransitioning: boolean;
  _setHydrated: () => void;
  setStep: (step: number) => void;
  setResponse: (questionId: number, value: string) => void;
  setIsTransitioning: (isTransitioning: boolean) => void;
  setSurveyResponseData: (data: Partial<SurveyResponseData>) => void;
  reset: () => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  resetSurvey: () => void;
}

const initialState = {
  _isHydrated: false,
  step: 0,
  direction: 1 as const,
  responses: {},
  surveyResponseData: {},
  isTransitioning: false,
};

export const initSurveyStore = ({
  totalQuestions,
}: { totalQuestions: number }) => ({
  ...initialState,
  totalQuestions,
  totalSteps: totalQuestions + 1,
});

export const createSurveyStore = (
  surveyId: string,
  initState: ReturnType<typeof initSurveyStore>,
) =>
  createStore<SurveyStoreState>()(
    persist(
      (set, get) => ({
        ...initState,
        _setHydrated: () => set(() => ({ _isHydrated: true })),
        setStep: (step) => {
          set(() => ({
            isTransitioning: true,
            step: step,
          }));
        },
        setResponse: (questionId, value) =>
          set((state) => ({
            responses: { ...state.responses, [questionId]: value },
          })),
        setSurveyResponseData: (data) =>
          set((state) => ({
            surveyResponseData: { ...state.surveyResponseData, ...data },
          })),
        setIsTransitioning: (isTransitioning) =>
          set(() => ({ isTransitioning })),
        reset: () => set(() => ({ ...initialState })),
        goToNextStep: () => {
          const step = get().step;
          const totalSteps = get().totalSteps;

          if (step >= totalSteps) return;

          set(() => ({
            isTransitioning: true,
            step: Math.min(step + 1, totalSteps),
            direction: 1,
          }));
        },
        goToPrevStep: () => {
          const step = get().step;
          if (step === 0) return;

          set(() => ({
            isTransitioning: true,
            step: Math.max(step - 1, 0),
            direction: -1,
          }));
        },
        resetSurvey: () => {
          set(() => ({
            responses: {},
            surveyResponseData: {},
          }));
        },
      }),
      {
        name: `survey-store-${surveyId}`,
        storage: superjsonStorage,
        partialize: ({ responses, surveyResponseData, totalQuestions }) => ({
          responses,
          surveyResponseData,
          totalQuestions,
        }),
        onRehydrateStorage: () => {
          return (state, error) => {
            if (!error) {
              state?._setHydrated();
            }
          };
        },
      },
    ),
  );
