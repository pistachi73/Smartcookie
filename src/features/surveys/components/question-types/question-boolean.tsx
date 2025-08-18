"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ThumbsDownIcon as ThumbsDownIconSolid,
  ThumbsUpIcon as ThumbsUpIconSolid,
} from "@hugeicons-pro/core-solid-rounded";
import {
  ThumbsDownIcon as ThumbsDownIconStroke,
  ThumbsUpIcon as ThumbsUpIconStroke,
} from "@hugeicons-pro/core-stroke-rounded";
import { useCallback, useEffect, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";

import {
  RadioToggle,
  RadioToggleGroup,
} from "@/shared/components/ui/radio-toggle-group";
import { cn } from "@/shared/lib/classes";

import { GO_TO_NEXT_QUESTION_DELAY } from "../../lib/question-type-registry";
import { useSurveyStore } from "../../store/survey-store-provider";
import { toggleStyles } from "./question-rating";

interface QuestionBooleanProps {
  questionId: number;
}

const options = [
  {
    label: "Yes",
    abb: "Y",
    value: "true",
    icon: ThumbsUpIconStroke,
    altIcon: ThumbsUpIconSolid,
  },
  {
    label: "No",
    abb: "N",
    value: "false",
    icon: ThumbsDownIconStroke,
    altIcon: ThumbsDownIconSolid,
  },
];

export const QuestionBoolean = ({ questionId }: QuestionBooleanProps) => {
  const goToNextQuestion = useSurveyStore((state) => state.goToNextStep);
  const setResponse = useSurveyStore((state) => state.setResponse);
  const step = useSurveyStore((state) => state.step);
  const totalQuestions = useSurveyStore((state) => state.totalQuestions);
  const isTransitioning = useSurveyStore((state) => state.isTransitioning);
  const setIsTransitioning = useSurveyStore(
    (state) => state.setIsTransitioning,
  );

  const { control, setValue } = useFormContext();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelect = useCallback(
    (value: string) => {
      const boolValue = value as "true" | "false";
      setValue(questionId.toString(), boolValue);
      setResponse(questionId, boolValue);

      if (step < totalQuestions && boolValue) {
        setIsTransitioning(true);
        setTimeout(() => {
          goToNextQuestion();
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
      goToNextQuestion,
    ],
  );

  const handleDelayedSelect = useCallback(
    (value: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        handleSelect(value);
      }, 300);
    },
    [handleSelect],
  );

  useHotkeys(
    "y",
    () => handleDelayedSelect("true"),
    {
      enabled: !isTransitioning,
      enableOnFormTags: false,
      preventDefault: true,
    },
    [handleDelayedSelect, isTransitioning],
  );

  useHotkeys(
    "n",
    () => handleDelayedSelect("false"),
    {
      enabled: !isTransitioning,
      enableOnFormTags: false,
      preventDefault: true,
    },
    [handleDelayedSelect, isTransitioning],
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
      render={({ field: { value: formValue } }) => (
        <RadioToggleGroup
          value={formValue}
          onChange={handleSelect}
          gap={2}
          aria-label="Select Yes or No"
        >
          {options.map(({ abb, icon, altIcon, value, label }) => {
            return (
              <RadioToggle
                aria-label={label}
                value={value}
                key={value}
                className={({ isSelected }) =>
                  toggleStyles({
                    isSelected,
                    className:
                      "size-32 flex flex-col items-center justify-center ",
                  })
                }
              >
                <HugeiconsIcon
                  className="mb-2"
                  icon={icon}
                  altIcon={altIcon}
                  showAlt={formValue === value}
                  size={24}
                />
                <div className="flex items-center gap-1">
                  <p
                    className={cn(
                      "text-muted-fg font-normal border rounded-xs aspect-square size-5 flex items-center justify-center text-xs",
                      formValue === value &&
                        "bg-primary text-primary-fg border-primary",
                    )}
                  >
                    {abb}
                  </p>
                  <span className="font-medium">{label}</span>
                </div>
              </RadioToggle>
            );
          })}
        </RadioToggleGroup>
      )}
    />
  );
};
