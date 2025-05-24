"use client";

import { useSurveyStore } from "../store/survey-store-provider";

export const SurveyProgressBar = ({ surveyId }: { surveyId: string }) => {
  const step = useSurveyStore((s) => s.step);
  const totalQuestions = useSurveyStore((s) => s.totalQuestions);
  const progress =
    totalQuestions > 0
      ? Math.min(100, Math.round((step / totalQuestions) * 100))
      : 0;

  return (
    <div className="fixed top-0 left-0 z-50 w-full">
      <div className="w-full h-2">
        <div
          className="bg-primary h-2 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
