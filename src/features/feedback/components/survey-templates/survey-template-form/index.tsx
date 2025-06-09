"use client";

import { Heading } from "@/shared/components/ui/heading";
import { MultistepFormProgress } from "@/shared/components/ui/multistep-form-progress";
import {
  BubbleChatPreviewIcon,
  BubbleChatQuestionIcon,
} from "@hugeicons-pro/core-solid-rounded";
import { useEffect } from "react";
import { useSurveyTemplateFormStore } from "../../../store/survey-template-form.store";
import { StepInfo } from "./step-info";
import { StepPreview } from "./step-preview";
import { StepSurveyQuestions } from "./step-survey-questions";

const STEP_CONTENT = {
  1: {
    title: "Survey Information",
    description: "Update the basic information about your survey.",
  },
  2: {
    title: "Survey Questions",
    description: "Modify and reorder the questions for your survey.",
  },
  3: {
    title: "Review Changes",
    description: "Review your changes before updating the survey.",
  },
} as const;

export const SurveyTemplateForm = () => {
  const currentStep = useSurveyTemplateFormStore((state) => state.currentStep);
  const totalSteps = useSurveyTemplateFormStore((state) => state.totalSteps);
  const reset = useSurveyTemplateFormStore((state) => state.reset);

  // Reset store on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepInfo />;
      case 2:
        return <StepSurveyQuestions />;
      case 3:
        return <StepPreview />;
      default:
        return <StepInfo />;
    }
  };

  const steps = [
    { id: 1, name: "Survey Info", icon: BubbleChatQuestionIcon },
    { id: 2, name: "Questions", icon: BubbleChatQuestionIcon },
    { id: 3, name: "Preview", icon: BubbleChatPreviewIcon },
  ];

  const stepContent =
    STEP_CONTENT[currentStep as keyof typeof STEP_CONTENT] || STEP_CONTENT[1];

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <Heading level={2}>{stepContent.title}</Heading>
        <p className="text-sm text-muted-fg">{stepContent.description}</p>
      </div>

      <div className="space-y-4">
        <MultistepFormProgress
          className={{ container: "w-full" }}
          totalSteps={totalSteps}
          currentStep={currentStep}
          steps={steps}
        />

        {renderStepContent()}
      </div>
    </div>
  );
};
