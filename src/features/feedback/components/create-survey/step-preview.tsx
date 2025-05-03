"use client";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCreateSurveyFormStore } from "../../store/create-survey-multistep-form.store";
import { QuestionTypeBadge } from "../question-type-badge";

export function StepPreview() {
  const surveyInfo = useCreateSurveyFormStore((state) => state.surveyInfo);
  const questions = useCreateSurveyFormStore((state) => state.questions);
  const nextStep = useCreateSurveyFormStore((state) => state.nextStep);
  const prevStep = useCreateSurveyFormStore((state) => state.prevStep);
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <Card.Header>
          <Card.Title>{surveyInfo.title}</Card.Title>
          <Card.Description>{surveyInfo.description}</Card.Description>
        </Card.Header>
        <Card.Content className="space-y-5">
          {questions.map((question, index) => (
            <div
              key={`survey-question-${question.id}`}
              className="flex-1 flex items-center gap-3"
            >
              <QuestionTypeBadge type={question.type} label={`${index + 1}`} />
              <p className="font-medium text-sm">
                {question.title}{" "}
                {question.required && <span className="text-danger">*</span>}
              </p>
            </div>
            // <div key={question.id}>
            //   <div className="flex items-center gap-3">
            //     <QuestionTypeBadge
            //       type={question.type}
            //       label={`${index + 1}`}
            //     />
            //     <h3 className="font-medium text-sm">
            //       {question.title}
            //       {question.required && (
            //         <span className="text-destructive ml-0.5 text-danger">
            //           *
            //         </span>
            //       )}
            //     </h3>
            //   </div>
            // </div>
          ))}
        </Card.Content>
      </Card>

      <div className="flex justify-between">
        <Button intent="secondary" onPress={prevStep}>
          <HugeiconsIcon icon={ArrowLeft02Icon} size={16} data-slot="icon" />
          Back
        </Button>

        <Button onPress={nextStep} isDisabled={questions.length === 0}>
          Create Survey
          <HugeiconsIcon icon={ArrowRight02Icon} size={16} data-slot="icon" />
        </Button>
      </div>
    </div>
  );
}
