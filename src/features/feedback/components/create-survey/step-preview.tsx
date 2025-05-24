"use client";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateSurvey } from "../../hooks/surveys/use-create-survey";
import { useCreateSurveyFormStore } from "../../store/create-survey-multistep-form.store";
import { QuestionTypeBadge } from "../question-type-badge";

export function StepPreview() {
  const router = useRouter();
  const { createHrefWithParams } = useNavigateWithParams();
  const surveyInfo = useCreateSurveyFormStore((state) => state.surveyInfo);
  const questions = useCreateSurveyFormStore((state) => state.questions);
  const prevStep = useCreateSurveyFormStore((state) => state.prevStep);

  const { mutate: createSurvey, isPending } = useCreateSurvey({
    onSuccess: () => {
      router.push(createHrefWithParams("/portal/feedback/"));
    },
  });

  const handleCreateSurvey = () => {
    if (!surveyInfo.title || !surveyInfo.description) {
      toast.error("Title and description are required");
      return;
    }

    createSurvey({
      title: surveyInfo.title,
      description: surveyInfo.description,
      questions,
    });
  };

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
            //   </div>5
            // </div>
          ))}
        </Card.Content>
      </Card>

      <div className="flex justify-between">
        <Button intent="secondary" onPress={prevStep}>
          <HugeiconsIcon icon={ArrowLeft02Icon} size={16} data-slot="icon" />
          Back
        </Button>

        <Button
          onPress={handleCreateSurvey}
          isDisabled={questions.length === 0}
          isPending={isPending}
        >
          {isPending && (
            <ProgressCircle isIndeterminate aria-label="Creating..." />
          )}
          Create Survey
        </Button>
      </div>
    </div>
  );
}
