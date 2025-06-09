"use client";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import {
  Clock01Icon,
  TickDouble03Icon,
} from "@hugeicons-pro/core-solid-rounded";
import {
  ArrowLeft02Icon,
  BubbleChatQuestionIcon,
  Delete02Icon,
  MessageEdit01Icon,
  MoreHorizontalIcon,
  Rocket01Icon,
} from "@hugeicons-pro/core-stroke-rounded";

import { surveyTemplateByIdQueryOptions } from "@/features/feedback/lib/survey-template-query-options";
import { Badge } from "@/shared/components/ui/badge";
import { Menu } from "@/shared/components/ui/menu";
import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { surveyTemplateResponsesQueryOptions } from "../../lib/survey-template-responses-query-options";
import { DataCard } from "../questions/question-details/question-answers/shared-cards";
import { FeedbackLoading } from "../shared/feedback-loading";
import { FeedbackNotFound } from "../shared/feedback-not-found";
import { DeleteSurveyTemplateModal } from "./delete-survey-template-modal";
import { InitSurveyFromFeedbackSheet } from "./init-survey-from-feedback-sheet";
import { SurveyTemplateResponses } from "./survey-template-responses";
import { TemplateQuestion } from "./template-question";

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
  const router = useRouter();
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
    `/portal/feedback/surveys/${surveyTemplateId}/edit`,
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

              <Menu>
                <Button intent="outline" shape="square" size="square-petite">
                  <HugeiconsIcon
                    icon={MoreHorizontalIcon}
                    size={18}
                    data-slot="icon"
                  />
                </Button>
                <Menu.Content placement="bottom end" showArrow>
                  <Menu.Item
                    onAction={() => {
                      setShowInitSurveySheet(true);
                    }}
                  >
                    <HugeiconsIcon
                      icon={Rocket01Icon}
                      size={16}
                      data-slot="icon"
                    />
                    Initiate Survey
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item
                    onAction={() => {
                      router.push(editHref);
                    }}
                  >
                    <HugeiconsIcon
                      icon={MessageEdit01Icon}
                      size={16}
                      data-slot="icon"
                    />
                    Edit Template
                  </Menu.Item>
                  <Menu.Item isDanger onAction={() => setShowDeleteModal(true)}>
                    <HugeiconsIcon
                      icon={Delete02Icon}
                      size={16}
                      data-slot="icon"
                    />
                    Delete Template
                  </Menu.Item>
                </Menu.Content>
              </Menu>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              className="flex items-center gap-2"
              intent="primary"
              shape="square"
            >
              <HugeiconsIcon
                icon={BubbleChatQuestionIcon}
                size={16}
                className="text-primary"
              />
              {surveyTemplate.questions.length}{" "}
              {surveyTemplate.questions.length === 1 ? "question" : "questions"}
            </Badge>
            <Badge
              className="flex items-center gap-2"
              intent="secondary"
              shape="square"
            >
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
                    <>
                      {averageResponseTime.seconds}
                      <span className="text-xs text-muted-fg">s</span>
                    </>
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
                spacing="sm"
                className="flex items-center gap-3 flex-row px-4"
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
