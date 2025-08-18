"use client";

import { useCallback, useEffect, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import { tv } from "tailwind-variants";

import {
  RadioToggle,
  RadioToggleGroup,
} from "@/shared/components/ui/radio-toggle-group";

import { GO_TO_NEXT_QUESTION_DELAY } from "../../lib/question-type-registry";
import { useSurveyStore } from "../../store/survey-store-provider";

export const toggleStyles = tv({
  base: "aspect-square h-auto bg-overlay text-sm sm:text-base font-medium rounded-xs sm:rounded-md",
  variants: {
    isSelected: {
      true: "bg-primary-tint! inset-ring-primary! transition-colors",
    },
  },
});
const ratingOptions = Array.from({ length: 10 }, (_, index) => ({
  value: `${index + 1}`,
  label: `${index + 1}`,
}));

type QuestionRatingProps = {
  questionId: number;
};

export const QuestionRating = ({ questionId }: QuestionRatingProps) => {
  const goToNextStep = useSurveyStore((state) => state.goToNextStep);
  const setResponse = useSurveyStore((state) => state.setResponse);
  const step = useSurveyStore((state) => state.step);
  const totalQuestions = useSurveyStore((state) => state.totalQuestions);
  const isTransitioning = useSurveyStore((state) => state.isTransitioning);
  const setIsTransitioning = useSurveyStore(
    (state) => state.setIsTransitioning,
  );

  const { control, setValue } = useFormContext();

  const handleSelect = useCallback(
    (rating: string) => {
      setValue(questionId.toString(), rating);
      setResponse(questionId, rating);

      if (step < totalQuestions && rating) {
        setIsTransitioning(true);
        setTimeout(() => {
          goToNextStep();
        }, GO_TO_NEXT_QUESTION_DELAY);
      }
    },
    [
      setValue,
      questionId,
      setResponse,
      step,
      totalQuestions,
      setIsTransitioning,
      goToNextStep,
    ],
  );

  // Refs for universal number input buffering (no re-renders needed)
  const keyBufferRef = useRef("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle all number keys with universal buffering
  useHotkeys(
    "0,1,2,3,4,5,6,7,8,9",
    (event) => {
      const digit = event.key;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      keyBufferRef.current += digit;
      const newBuffer = keyBufferRef.current;

      // Set timeout to process the buffer
      timerRef.current = setTimeout(() => {
        if (newBuffer === "10") {
          handleSelect("10");
        } else if (newBuffer === "0") {
          handleSelect("10");
        } else if (/^[1-9]$/.test(newBuffer)) {
          handleSelect(newBuffer);
        }
        keyBufferRef.current = ""; // Reset buffer
      }, 300);
    },
    {
      enabled: !isTransitioning,
      enableOnFormTags: false,
      preventDefault: true,
    },
    [isTransitioning, handleSelect],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <Controller
      control={control}
      name={questionId.toString()}
      render={({ field: { value } }) => (
        <RadioToggleGroup
          value={value}
          aria-label="Rating scale from 1 to 10"
          onChange={handleSelect}
          gap={1}
          className={{
            content: "w-full grid grid-cols-5 sm:grid-cols-10 ",
          }}
        >
          {ratingOptions.map((option) => (
            <RadioToggle
              aria-label={`${option.label} rating`}
              value={option.value}
              key={option.value}
              className={({ isSelected }) =>
                toggleStyles({
                  isSelected,
                })
              }
            >
              {option.label}
            </RadioToggle>
          ))}
        </RadioToggleGroup>
      )}
    />
  );
};
