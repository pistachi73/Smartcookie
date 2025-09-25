"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-m";

import { cn } from "@/shared/lib/utils";

import { useSurvey } from "../hooks/use-survey";
import { containerVariants } from "../lib/survey-animation-variants";
import { getSurveyByIdQueryOptions } from "../lib/survey-query-options";
import {
  SurveyStoreProvider,
  useSurveyStore,
} from "../store/survey-store-provider";
import { SurveyBottomBar } from "./survey-bottom-bar";
import { SurveyNotFound } from "./survey-not-found";
import { SurveyOutBoundaries } from "./survey-out-boundaries";
import { SurveyPresentation } from "./survey-presentation";
import { SurveyProgressBar } from "./survey-progress-bar";
import { SurveyQuestion } from "./survey-question";
import SurveyThankYou from "./survey-thank-you";

export const SurveyComponent = ({ surveyId }: { surveyId: string }) => {
  const step = useSurveyStore((state) => state.step);
  const direction = useSurveyStore((state) => state.direction);
  const { data: survey } = useSurvey(surveyId);
  const question = survey?.questions[step - 1];
  const isHydrated = useSurveyStore((state) => state._isHydrated);
  const totalSteps = useSurveyStore((state) => state.totalSteps);
  const setIsTransitioning = useSurveyStore(
    (state) => state.setIsTransitioning,
  );
  if (!isHydrated) {
    return <div className="w-screen h-screen bg-bg" />;
  }

  if (!survey) {
    return <SurveyNotFound />;
  }

  if (step > 0 && step < totalSteps && !question) {
    return <SurveyOutBoundaries />;
  }

  const onBoundarySteps = step === 0 || step === totalSteps;

  return (
    <div className="h-screen w-screen flex flex-col bg-bg relative">
      {!onBoundarySteps && <SurveyProgressBar />}
      <div
        className={cn(
          "flex-1 flex items-center justify-center overflow-hidden px-10 md:px-16 mb-12 md:mb-16",
          step === 0 && "px-4",
        )}
      >
        <AnimatePresence
          initial={false}
          mode="wait"
          custom={direction}
          onExitComplete={() => {
            setTimeout(() => {
              setIsTransitioning(false);
            }, 400);
          }}
        >
          <motion.div
            key={step}
            custom={direction}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex items-center justify-center"
          >
            {step === 0 ? (
              <SurveyPresentation surveyId={surveyId} />
            ) : step === totalSteps ? (
              <SurveyThankYou />
            ) : (
              <SurveyQuestion question={question!} step={step} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {!onBoundarySteps && <SurveyBottomBar />}
    </div>
  );
};

export const Survey = ({ surveyId }: { surveyId: string }) => {
  const { data: survey } = useSuspenseQuery(
    getSurveyByIdQueryOptions(surveyId),
  );

  if (!survey) {
    return <SurveyNotFound />;
  }

  return (
    <SurveyStoreProvider
      surveyId={surveyId}
      totalQuestions={survey.questions.length}
    >
      <SurveyComponent surveyId={surveyId} />
    </SurveyStoreProvider>
  );
};
