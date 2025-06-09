"use client";

import { Heading } from "@/shared/components/ui/heading";
import { UserGroupIcon } from "@hugeicons-pro/core-stroke-rounded";

import { surveyTemplateResponsesQueryOptions } from "@/features/feedback/lib/survey-template-query-options";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FeedbackLoading } from "../../shared/feedback-loading";
import { FeedbackNotFound } from "../../shared/feedback-not-found";
import { SurveyNoResponses } from "./survey-no-responses";
import { SurveyResponse } from "./survey-response";

interface SurveyResponseProps {
  surveyTemplateId: number;
}

export const SurveyResponses = ({ surveyTemplateId }: SurveyResponseProps) => {
  const [openResponseId, setOpenResponseId] = useState<number | null>(null);

  const {
    data: surveyTemplateResponses,
    isPending,
    error,
  } = useQuery(surveyTemplateResponsesQueryOptions(surveyTemplateId));

  if (isPending) {
    return <FeedbackLoading title="Loading responses..." />;
  }

  if (error) {
    return (
      <FeedbackNotFound
        title="Error loading responses"
        description="Please try again later."
      />
    );
  }

  if (!surveyTemplateResponses?.responses.length) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={UserGroupIcon}
            size={18}
            className="text-primary"
          />
          <Heading level={3}>Survey Responses</Heading>
        </div>
        <SurveyNoResponses />
      </section>
    );
  }

  const handleResponseToggle = (responseId: number) => {
    setOpenResponseId(openResponseId === responseId ? null : responseId);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={UserGroupIcon}
          size={18}
          className="text-primary"
        />
        <Heading level={3}>Survey Responses</Heading>
      </div>

      <div className="space-y-2">
        {surveyTemplateResponses?.responses.map((response) => (
          <SurveyResponse
            key={response.id}
            isOpen={openResponseId === response.id}
            handleToggle={() => handleResponseToggle(response.id)}
            response={response}
            surveyTemplateId={surveyTemplateId}
          />
        ))}
      </div>
    </section>
  );
};
