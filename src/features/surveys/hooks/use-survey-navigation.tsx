import { useEffect } from "react";
import { useSurveyStore } from "../store/survey-store-provider";

type SurveyNavigationOptions = {
  preventDefault?: boolean;
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTransitioning) return;
      const { key } = event;

      // If we're in an input field (except for Enter key), don't navigate
      const activeElement = document.activeElement;
      const isInputActive =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA";

      if (
        (isInputActive && key !== "Enter") ||
        (isInputActive && event.shiftKey)
      ) {
        return;
      }

      // Handle next question or submit
      if (keys.next?.includes(key)) {
        event.preventDefault();
        onSubmit();
      }

      // Handle previous question (left arrow)
      if (keys.previous?.includes(key) && !isFirstQuestion) {
        event.preventDefault();
        goToPrevStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToPrevStep, isFirstQuestion, keys, onSubmit, isTransitioning]);
};
