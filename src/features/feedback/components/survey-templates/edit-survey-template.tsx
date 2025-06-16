"use client";

import { Link } from "@/shared/components/ui/link";
import { useNavigateWithParams } from "@/shared/hooks/use-navigate-with-params";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { surveyTemplateByIdQueryOptions } from "../../lib/survey-template-query-options";
import { useSurveyTemplateFormStore } from "../../store/survey-template-form.store";
import { FeedbackLoading } from "../shared/feedback-loading";
import { FeedbackNotFound } from "../shared/feedback-not-found";
import { SurveyTemplateForm } from "./survey-template-form";

interface EditSurveyTemplateProps {
  surveyTemplateId: number;
}

export const EditSurveyTemplate = ({
  surveyTemplateId,
}: EditSurveyTemplateProps) => {
  const { createHrefWithParams } = useNavigateWithParams();
  const backHref = createHrefWithParams("/portal/feedback");
  const initializeForEdit = useSurveyTemplateFormStore(
    (state) => state.initializeForEdit,
  );

  const {
    data: surveyTemplate,
    isLoading,
    error,
  } = useQuery(surveyTemplateByIdQueryOptions(surveyTemplateId));

  // Initialize the store with survey data when it loads
  useEffect(() => {
    if (surveyTemplate) {
      initializeForEdit({
        id: surveyTemplate.id,
        title: surveyTemplate.title,
        description: surveyTemplate.description || undefined,
        questions: surveyTemplate.questions.map((q) => ({
          ...q,
          description: q.description || "",
          // Add missing properties with default values
          updatedAt: new Date().toISOString(),
          answerCount: 0,
        })),
      });
    }
  }, [surveyTemplate, initializeForEdit]);

  if (isLoading) {
    return <FeedbackLoading title="Loading survey template..." />;
  }

  if (error || !surveyTemplate) {
    return (
      <FeedbackNotFound
        title="Survey template not found"
        description="This survey template seems to have vanished into thin air!"
      />
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <Link
        intent="secondary"
        href={backHref}
        className="flex items-center gap-1.5 text-sm"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={18} data-slot="icon" />
        Back
      </Link>

      <SurveyTemplateForm />
    </div>
  );
};
