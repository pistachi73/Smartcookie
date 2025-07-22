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
import { useCallback, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

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

  const { control, setValue, getValues } = useFormContext();

  const handleSelect = useCallback(
    (value: string) => {
      if (isTransitioning) return;
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
    [isTransitioning],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "y") {
        handleSelect("true");
      } else if (e.key.toLowerCase() === "n") {
        handleSelect("false");
      }
    },
    [handleSelect],
  );

  useEffect(() => {
    const abortController = new AbortController();
    window.addEventListener("keydown", handleKeyDown, {
      signal: abortController.signal,
    });

    return () => {
      abortController.abort();
    };
  }, [handleKeyDown]);

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
