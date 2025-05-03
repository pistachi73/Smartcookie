"use client";

import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import { MultistepFormProgress } from "@/shared/components/ui/multistep-form-progress";
import { useNavigateWithParams } from "@/shared/hooks/use-navigate-with-params";
import {
  BubbleChatPreviewIcon,
  BubbleChatQuestionIcon,
} from "@hugeicons-pro/core-solid-rounded";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useCreateSurveyFormStore } from "../../store/create-survey-multistep-form.store";
import { StepInfo } from "./step-info";
import { StepPreview } from "./step-preview";
import { StepSurveyQuestions } from "./step-survey-questions";

const STEP_CONTENT = {
  1: {
    title: "Survey Information",
    description: "Start by providing basic information about your survey.",
  },
  2: {
    title: "Survey Questions",
    description: "Select and order the questions for your survey.",
  },
  3: {
    title: "Review Survey",
    description: "Review your survey before publishing it.",
  },
} as const;

export const CreateSurvey = () => {
  const router = useRouter();
  const { createHrefWithParams } = useNavigateWithParams();
  const backHref = createHrefWithParams("/portal/feedback");

  const currentStep = useCreateSurveyFormStore((state) => state.currentStep);
  const totalSteps = useCreateSurveyFormStore((state) => state.totalSteps);

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

  return (
    <div className="flex flex-col gap-6">
      {/* <Link
        intent="secondary"
        href={backHref}
        className={"flex items-center gap-1.5 text-sm mb-4"}
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={18} data-slot="icon" />
        Back
      </Link> */}

      <Link
        intent="secondary"
        href={backHref}
        className="flex items-center gap-1.5 text-sm"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={18} data-slot="icon" />
        Back
      </Link>

      <div className="space-y-1">
        <Heading level={2}>
          {STEP_CONTENT[currentStep as keyof typeof STEP_CONTENT].title}
        </Heading>
        <p className="text-sm text-muted-fg">
          {STEP_CONTENT[currentStep as keyof typeof STEP_CONTENT].description}
        </p>
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
