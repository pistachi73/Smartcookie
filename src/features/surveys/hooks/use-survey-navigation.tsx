import { useHotkeys } from "react-hotkeys-hook";

import { useSurveyStore } from "../store/survey-store-provider";

type SurveyNavigationOptions = {
  onSubmit: () => void;
  keys?: {
    next?: string[];
    previous?: string[];
  };
};

const defaultKeys = {
  next: ["ArrowRight", "Enter"],
  previous: ["ArrowLeft"],
};

export const useSurveyNavigation = ({
  onSubmit,
  keys = defaultKeys,
}: SurveyNavigationOptions) => {
  const currentStep = useSurveyStore((state) => state.step);
  const goToPrevStep = useSurveyStore((state) => state.goToPrevStep);
  const isFirstQuestion = currentStep === 1;
  const isTransitioning = useSurveyStore((state) => state.isTransitioning);

  // Handle next navigation (arrow right, enter)
  useHotkeys(
    keys.next ?? defaultKeys.next,
    (event) => {
      // Block Shift+Enter in form fields
      if (event.shiftKey && event.key === "Enter") return;

      event.preventDefault();
      onSubmit();
    },
    {
      enabled: !isTransitioning,
      enableOnFormTags: ["input", "textarea"], // Allow Enter in form fields
      preventDefault: true,
    },
    [onSubmit, isTransitioning],
  );

  // Handle previous navigation (arrow left)
  useHotkeys(
    keys.previous ?? defaultKeys.previous,
    (event) => {
      event.preventDefault();
      goToPrevStep();
    },
    {
      enabled: !isTransitioning && !isFirstQuestion,
      enableOnFormTags: false, // Don't allow arrow keys in form fields
      preventDefault: true,
    },
    [goToPrevStep, isFirstQuestion, isTransitioning],
  );
};
