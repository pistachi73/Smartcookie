"use client";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateSurveyTemplate } from "../../../hooks/survey-templates/use-create-survey-template";
import { useUpdateSurveyTemplate } from "../../../hooks/survey-templates/use-update-survey-template";
import { useSurveyTemplateFormStore } from "../../../store/survey-template-form.store";
import { QuestionTypeBadge } from "../../questions/question-type-badge";
import { QuestionChangeIndicators } from "./question-change-indicators";

export function StepPreview() {
  const router = useRouter();
  const { createHrefWithParams } = useNavigateWithParams();
  const surveyInfo = useSurveyTemplateFormStore((state) => state.surveyInfo);
  const questions = useSurveyTemplateFormStore((state) => state.questions);
  const prevStep = useSurveyTemplateFormStore((state) => state.prevStep);
  const mode = useSurveyTemplateFormStore((state) => state.mode);
  const getChanges = useSurveyTemplateFormStore((state) => state.getChanges);

  const { mutate: createSurvey, isPending: isCreating } =
    useCreateSurveyTemplate({
      onSuccess: () => {
        router.push(createHrefWithParams("/portal/feedback/"));
      },
    });

  const { mutate: updateSurvey, isPending: isUpdating } =
    useUpdateSurveyTemplate({
      onSuccess: () => {
        router.push(createHrefWithParams("/portal/feedback/"));
      },
    });

  const isPending = isCreating || isUpdating;

  // Get changes for edit mode
  const changes = mode === "edit" ? getChanges() : null;

  const getQuestionChanges = (questionId: number) => {
    if (!changes) return [];
    const updatedQuestion = changes.updated.find((q) => q.id === questionId);
    return updatedQuestion?.changes || [];
  };

  const handleSubmit = () => {
    if (!surveyInfo.title) {
      toast.error("Title is required");
      return;
    }

    if (mode === "create") {
      createSurvey({
        title: surveyInfo.title,
        description: surveyInfo.description,
        questions: questions.map((q) => ({
          id: q.id,
          required: q.required,
        })),
      });
    } else {
      // Edit mode
      if (!surveyInfo.id) {
        toast.error("Survey ID is required for editing");
        return;
      }

      updateSurvey({
        id: surveyInfo.id,
        title: surveyInfo.title,
        description: surveyInfo.description,
        questions: questions.map((q) => ({
          id: q.id,
          required: q.required,
          order: q.order || 0,
          surveyTemplateQuestionId: q.surveyTemplateQuestionId,
        })),
      });
    }
  };

  const buttonText = mode === "create" ? "Create Survey" : "Update Survey";
  const loadingText = mode === "create" ? "Creating..." : "Updating...";

  return (
    <div className="space-y-6">
      <div className="space-y-1 mt-8">
        <Heading level={3} className="font-semibold">
          {surveyInfo.title}
        </Heading>
        {surveyInfo.description && (
          <p className="text-sm text-muted-fg">{surveyInfo.description}</p>
        )}
      </div>

      <div className="space-y-3">
        <Heading level={4}>Questions ({questions.length})</Heading>
        {questions.length === 0 ? (
          <Card className="p-4 text-center text-muted-fg">
            No questions selected
          </Card>
        ) : (
          <div className="space-y-2">
            {questions.map((question, index) => {
              const questionChanges = getQuestionChanges(question.id);

              return (
                <div
                  key={`survey-template-question-${question.id}`}
                  className="p-4 py-4 flex items-center gap-4 border rounded-lg"
                >
                  <QuestionTypeBadge
                    type={question.type}
                    label={`${index + 1}`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {question.title}
                      {question.required && (
                        <span className="text-danger">*</span>
                      )}
                    </p>
                    {question.description && (
                      <p className="text-xs text-muted-fg mt-1">
                        {question.description}
                      </p>
                    )}
                  </div>
                  {mode === "edit" && (
                    <QuestionChangeIndicators changes={questionChanges} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button intent="secondary" onPress={prevStep} isDisabled={isPending}>
          <HugeiconsIcon icon={ArrowLeft02Icon} size={16} data-slot="icon" />
          Back
        </Button>

        <Button onPress={handleSubmit} isPending={isPending}>
          {isPending && (
            <ProgressCircle isIndeterminate aria-label={loadingText} />
          )}
          {isPending ? loadingText : buttonText}
        </Button>
      </div>
    </div>
  );
}
