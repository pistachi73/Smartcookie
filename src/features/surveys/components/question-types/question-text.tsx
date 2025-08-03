"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Textarea } from "@/shared/components/ui/textarea";

import { useSurveyStore } from "../../store/survey-store-provider";

interface QuestionTextProps {
  questionId: number;
}

export const QuestionText = ({ questionId }: QuestionTextProps) => {
  const setResponse = useSurveyStore((state) => state.setResponse);

  const { control } = useFormContext();

  return (
    <div className="w-full space-y-0.5">
      <Controller
        control={control}
        name={questionId.toString()}
        render={({
          field: { onChange, ...field },
          fieldState: { invalid },
        }) => (
          <Textarea
            {...field}
            aria-label={"question-text-input"}
            onChange={(value) => {
              onChange(value);
              setResponse(questionId, value);
            }}
            className={{
              primitive: "w-full",
              textarea: "resize-none bg-overlay text-base md:text-lg p-4",
            }}
            placeholder={"Type your answer here..."}
            isInvalid={invalid}
            autoFocus
          />
        )}
      />
      <span className="text-muted-fg text-xs">
        <span className="text-fg font-semibold inline-flex mr-0.5">
          Shift ⇧ + Enter ↵
        </span>{" "}
        to add a new line
      </span>
    </div>
  );
};
