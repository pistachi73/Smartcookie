"use client";

import { useCallback, useEffect, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
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
  const keyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const keyBufferRef = useRef<string>("");
  const step = useSurveyStore((state) => state.step);
  const totalQuestions = useSurveyStore((state) => state.totalQuestions);
  const isTransitioning = useSurveyStore((state) => state.isTransitioning);
  const setIsTransitioning = useSurveyStore(
    (state) => state.setIsTransitioning,
  );

  const { control, setValue } = useFormContext();

  const handleSelect = useCallback(
    (rating: string) => {
      if (isTransitioning) return;
      setValue(questionId.toString(), rating);
      setResponse(questionId, rating);

      if (step < totalQuestions && rating) {
        setIsTransitioning(true);
        setTimeout(() => {
          goToNextStep();
        }, GO_TO_NEXT_QUESTION_DELAY);
      }
    },
    [isTransitioning],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (keyTimerRef.current) {
        clearTimeout(keyTimerRef.current);
      }

      if (/^[0-9]$/.test(e.key)) {
        keyBufferRef.current += e.key;
        keyTimerRef.current = setTimeout(() => {
          const bufferValue = keyBufferRef.current;

          if (bufferValue === "10") {
            handleSelect("10");
          } else if (bufferValue.length === 1 && /^[1-9]$/.test(bufferValue)) {
            handleSelect(bufferValue);
          } else if (bufferValue === "0") {
            handleSelect("10");
          }

          keyBufferRef.current = "";
        }, 200);
      }
    },
    [handleSelect, isTransitioning],
  );

  useEffect(() => {
    const abortController = new AbortController();
    window.addEventListener("keydown", handleKeyDown, {
      signal: abortController.signal,
    });

    return () => {
      abortController.abort();
      if (keyTimerRef.current) {
        clearTimeout(keyTimerRef.current);
      }
    };
  }, [handleKeyDown]);

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
