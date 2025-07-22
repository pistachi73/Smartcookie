"use client";

import { createContext, type ReactNode, use, useRef } from "react";
import { useStore } from "zustand";

import type { SurveyStoreState } from "./survey.store";
import { createSurveyStore, initSurveyStore } from "./survey.store";

export type SurveyStoreApi = ReturnType<typeof createSurveyStore>;

export const SurveyStoreContext = createContext<SurveyStoreApi | undefined>(
  undefined,
);

export interface SurveyStoreProviderProps {
  children: ReactNode;
  surveyId: string;
  totalQuestions: number;
}

export const SurveyStoreProvider = ({
  children,
  surveyId,
  totalQuestions,
}: SurveyStoreProviderProps) => {
  const storeRef = useRef<SurveyStoreApi | undefined>(undefined);

  if (!storeRef.current) {
    storeRef.current = createSurveyStore(
      surveyId,
      initSurveyStore({ totalQuestions }),
    );
  }

  return (
    <SurveyStoreContext.Provider value={storeRef.current}>
      {children}
    </SurveyStoreContext.Provider>
  );
};

export const useSurveyStore = <T,>(
  selector: (store: SurveyStoreState) => T,
): T => {
  const surveyStoreContext = use(SurveyStoreContext);
  if (!surveyStoreContext) {
    throw new Error("useSurveyStore must be used within SurveyStoreProvider");
  }
  return useStore(surveyStoreContext, selector);
};
