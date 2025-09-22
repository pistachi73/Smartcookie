"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  TickDouble03Icon,
} from "@hugeicons-pro/core-solid-rounded";
import {
  ArrowLeft02Icon,
  BubbleChatQuestionIcon,
  Rocket01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useQueries } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";

import { surveyTemplateByIdQueryOptions } from "@/features/feedback/lib/survey-template-query-options";
import { surveyTemplateResponsesQueryOptions } from "../../lib/survey-template-responses-query-options";
import { DataCard } from "../questions/question-details/question-answers/shared-cards";
import { FeedbackLoading } from "../shared/feedback-loading";
import { FeedbackNotFound } from "../shared/feedback-not-found";
import { SurveyTemplateDetailsMenuTrigger } from "./survey-template-details-menu/survey-template-details-menu-trigger";
import { SurveyTemplateResponses } from "./survey-template-responses";
import { TemplateQuestion } from "./template-question";

const InitSurveyFromFeedbackSheet = dynamic(
  () =>
    import("./init-survey-from-feedback-sheet").then((mod) => ({
      default: mod.InitSurveyFromFeedbackSheet,
    })),
  {
    ssr: false,
  },
);
const DeleteSurveyTemplateModal = dynamic(
  () =>
    import("./delete-survey-template-modal").then((mod) => ({
      default: mod.DeleteSurveyTemplateModal,
    })),
  {
    ssr: false,
  },
);

const SurveyTemplateDetailsMenu = dynamic(
  () =>
    import("./survey-template-details-menu").then((mod) => ({
      default: mod.SurveyTemplateDetailsMenu,
    })),
  {
    ssr: false,
    loading: () => <SurveyTemplateDetailsMenuTrigger isLazyLoading />,
  },
);

type SurveyTemplateDetailsProps = {
  surveyTemplateId: number;
};

const formatResponseTime = (
  milliseconds: number,
): { minutes: number; seconds: number } => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { minutes, seconds };
};

const getCompletionRateColors = (rate: number) => {
  if (rate >= 80) {
    return {
      value: "text-success",
      icon: "bg-success/10 text-success",
    };
  }
  if (rate >= 50) {
    return {
      value: "text-warning",
      icon: "bg-warning/10 text-warning",
    };
  }
  return {
    value: "text-danger",
    icon: "bg-danger/10 text-danger",
  };
};

export const SurveyTemplateDetails = ({
  surveyTemplateId,
}: SurveyTemplateDetailsProps) => {
  const { createHrefWithParams } = useNavigateWithParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInitSurveySheet, setShowInitSurveySheet] = useState(false);

  const [surveyTemplateQuery, responsesQuery] = useQueries({
    queries: [
      surveyTemplateByIdQueryOptions(surveyTemplateId),
      surveyTemplateResponsesQueryOptions(surveyTemplateId),
    ],
  });

  const surveyTemplate = surveyTemplateQuery.data;
  const { responses, uncompletedCount } = responsesQuery.data || {
    responses: [],
    uncompletedCount: 0,
  };

  if (surveyTemplateQuery.isLoading || responsesQuery.isLoading) {
    return <FeedbackLoading title="Loading survey template..." />;
  }

  if (!surveyTemplate) {
    return (
      <FeedbackNotFound
        title="Survey template not found"
        description="This survey template seems to have vanished into thin air!"
      />
    );
  }

  const completionRate = surveyTemplate.totalResponses
    ? (surveyTemplate.totalResponses /
        (uncompletedCount + surveyTemplate.totalResponses)) *
      100
    : 0;

  const completionColors = getCompletionRateColors(completionRate);

  const editHref = createHrefWithParams(
    `/portal/feedback/survey-templates/${surveyTemplateId}/edit`,
  );

  const averageResponseTime = surveyTemplate.averageResponseTime
    ? formatResponseTime(surveyTemplate.averageResponseTime)
    : null;

  return (
    <>
      <div className="space-y-8">
        <Link
          intent="secondary"
          href="/portal/feedback"
          className="flex items-center gap-1.5 text-sm mb-6"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={18} data-slot="icon" />
          Back to hall
        </Link>

        <section className="flex flex-col gap-3">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <Heading
                  level={2}
                  className="sm:text-2xl font-bold first-letter:uppercase"
                  tracking="tight"
                >
                  {surveyTemplate.title}
                </Heading>

                {surveyTemplate.description && (
                  <p className="text-muted-fg text-base first-letter:uppercase">
                    {surveyTemplate.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <SurveyTemplateDetailsMenu
                  editHref={editHref}
                  setShowInitSurveySheet={setShowInitSurveySheet}
                  setShowDeleteModal={setShowDeleteModal}
                />
                <Button
                  intent="secondary"
                  size="sm"
                  onPress={() => setShowInitSurveySheet(true)}
                >
                  <HugeiconsIcon
                    icon={Rocket01Icon}
                    size={16}
                    data-slot="icon"
                  />
                  Init survey
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="flex items-center gap-2" intent="primary">
              <HugeiconsIcon
                icon={BubbleChatQuestionIcon}
                size={16}
                className="text-primary"
              />
              {surveyTemplate.questions.length}{" "}
              {surveyTemplate.questions.length === 1 ? "question" : "questions"}
            </Badge>
            <Badge className="flex items-center gap-2" intent="secondary">
              {responses?.length || 0}{" "}
              {responses?.length === 1 ? "response" : "responses"}
            </Badge>
          </div>
        </section>

        {!!surveyTemplate.totalResponses && (
          <section className="grid grid-cols-2 gap-2">
            {/* <ResponseCard totalResponses={responses?.length || 0} /> */}
            <DataCard
              iconProps={{
                icon: TickDouble03Icon,
                size: 18,
              }}
              label="Completion Rate"
              className={{ ...completionColors }}
              value={
                surveyTemplate.totalResponses ? (
                  <>
                    {completionRate.toFixed(0)}
                    <span className="text-xs">%</span>
                  </>
                ) : (
                  "N/A"
                )
              }
            />
            <DataCard
              iconProps={{
                icon: Clock01Icon,
                size: 18,
              }}
              label="Avg Response Time"
              className={{
                icon: "bg-blue-50 text-blue-600",
              }}
              value={
                averageResponseTime ? (
                  <>
                    {averageResponseTime.minutes > 0 && (
                      <>
                        {averageResponseTime.minutes}
                        <span className="text-xs text-muted-fg mr-1">m</span>
                      </>
                    )}

                    {averageResponseTime.seconds}
                    <span className="text-xs text-muted-fg">s</span>
                  </>
                ) : (
                  "N/A"
                )
              }
            />
          </section>
        )}

        {/* Questions Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={BubbleChatQuestionIcon}
              size={18}
              className="text-primary"
            />
            <Heading level={3}>Questions</Heading>
          </div>

          <div className="space-y-2">
            {surveyTemplate.questions.map((question) => (
              <Card
                key={`survey-template-question-${question.id}`}
                className="flex items-center gap-3 flex-row px-4 [--card-spacing:--spacing(4)]"
              >
                <TemplateQuestion {...question} />
              </Card>
            ))}
          </div>
        </section>

        <SurveyTemplateResponses surveyTemplateId={surveyTemplateId} />
      </div>
      {surveyTemplateQuery.data && (
        <DeleteSurveyTemplateModal
          isOpen={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          surveyTemplate={{
            id: surveyTemplateQuery.data.id,
            title: surveyTemplateQuery.data.title,
            description: surveyTemplateQuery.data.description,
          }}
        />
      )}
      <InitSurveyFromFeedbackSheet
        isOpen={showInitSurveySheet}
        onOpenChange={setShowInitSurveySheet}
        surveyTemplateId={surveyTemplateId}
      />
    </>
  );
};
