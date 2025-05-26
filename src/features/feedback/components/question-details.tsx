"use client";

import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import {
  ArrowLeft02Icon,
  ChartHistogramIcon,
  Clock01Icon,
  HelpCircleIcon,
  MailOpen01Icon,
  SearchIcon,
  StarIcon,
  TextIcon,
  ThumbsUpIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuestion } from "../hooks/use-question";
import { QuestionAnswersBoolean } from "./question-answers/question-answers-boolean";
import { QuestionAnswersRating } from "./question-answers/question-answers-rating";
import { QuestionAnswersText } from "./question-answers/question-answers-text";
import { QuestionTypeBadge } from "./question-type-badge";

type QuestionDetailsProps = {
  questionId: number;
};

export const QuestionDetails = ({ questionId }: QuestionDetailsProps) => {
  const { data: question, isPending } = useQuestion(Number(questionId));

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <HugeiconsIcon
                icon={HelpCircleIcon}
                size={20}
                className="text-primary animate-pulse"
              />
            </div>
          </div>
          <p className="text-sm text-muted-fg animate-pulse">
            Loading something awesome...
          </p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <HugeiconsIcon
            icon={SearchIcon}
            size={64}
            className="mx-auto text-muted-fg animate-bounce"
          />
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Oops! Question not found
            </h3>
            <p className="text-sm text-muted-fg">
              This question seems to have vanished into thin air!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderAnswersByType = () => {
    switch (question.type) {
      case "rating":
        return <QuestionAnswersRating answers={question.answers} />;
      case "boolean":
        return <QuestionAnswersBoolean answers={question.answers} />;
      case "text":
        return <QuestionAnswersText answers={question.answers} />;
      default:
        return null;
    }
  };

  const getQuestionIcon = () => {
    switch (question.type) {
      case "rating":
        return StarIcon;
      case "boolean":
        return ThumbsUpIcon;
      case "text":
        return TextIcon;
      default:
        return HelpCircleIcon;
    }
  };

  return (
    <div className="space-y-10">
      <Link
        intent="secondary"
        href="/portal/feedback"
        className={"flex items-center gap-1.5 text-sm mb-6"}
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={18} data-slot="icon" />
        Back to hall
      </Link>

      <div className="flex items-start gap-4">
        <section className="flex flex-col gap-3">
          <div className="space-y-0.5">
            <Heading level={2}>{question.title}</Heading>

            {question.description && (
              <p className="text-muted-fg text-sm">{question.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <QuestionTypeBadge label type={question.type} />
            <p className="text-sm text-muted-fg">
              {question.answerCount}{" "}
              {question.answerCount === 1 ? "response" : "responses"}
            </p>
          </div>
        </section>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {question.answers.length > 0 ? (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <HugeiconsIcon
                icon={ChartHistogramIcon}
                size={18}
                className="text-primary"
              />
              <Heading level={3}>Response Analytics</Heading>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
            </div>

            <div className="relative">{renderAnswersByType()}</div>
          </section>
        ) : (
          <div className="text-center py-16">
            <HugeiconsIcon
              icon={MailOpen01Icon}
              size={64}
              className="mx-auto text-muted-fg mb-4 animate-bounce"
            />
            <h3 className="text-xl font-semibold mb-2">No responses yet!</h3>
            <p className="text-muted-fg mb-4">
              This question is patiently waiting for its first response...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-fg">
              <span>Check back soon</span>
              <HugeiconsIcon
                icon={Clock01Icon}
                size={14}
                className="animate-pulse"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
