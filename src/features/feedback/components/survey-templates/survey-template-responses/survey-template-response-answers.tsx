import { QuestionTypeBadge } from "@/features/feedback/components/questions/question-type-badge";
import { surveyTemplateByIdQueryOptions } from "@/features/feedback/lib/survey-template-query-options";
import { surveyTemplateResponseAnswersQueryOptions } from "@/features/feedback/lib/survey-template-responses-query-options";
import { cn } from "@/shared/lib/classes";
import {
  StarIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueries } from "@tanstack/react-query";

interface SurveyResponseAnswersProps {
  surveyResponseId: number;
  surveyTemplateId: number;
}

interface RatingStarsProps {
  rating: number;
}

interface BooleanResponseProps {
  value: string;
}

interface NotAnsweredResponseProps {
  wasAddedLater: boolean;
}

const validateAnswer = (questionType: string, value: string) => {
  switch (questionType) {
    case "text":
      return value && value.trim().length > 0;
    case "rating": {
      const rating = Number.parseInt(value, 10);
      return !Number.isNaN(rating) && rating >= 1 && rating <= 10;
    }
    case "boolean":
      return value === "true" || value === "false";
    default:
      return false;
  }
};

const RatingStars = ({ rating }: RatingStarsProps) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 10 }, (_, i) => (
        <HugeiconsIcon
          key={i}
          icon={StarIcon}
          size={16}
          className={cn(
            "transition-colors",
            i < rating ? "text-yellow-500 fill-yellow-500" : "text-muted-fg",
          )}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-muted-fg">
        {rating}/10
      </span>
    </div>
  );
};

const BooleanResponse = ({ value }: BooleanResponseProps) => {
  const isTrue = value === "true";
  return (
    <div className="flex items-center gap-2">
      <HugeiconsIcon
        icon={isTrue ? ThumbsUpIcon : ThumbsDownIcon}
        size={18}
        className={cn(
          "transition-colors",
          isTrue ? "text-success" : "text-danger",
        )}
      />
      <span
        className={cn("font-medium", isTrue ? "text-success" : "text-danger")}
      >
        {isTrue ? "Yes" : "No"}
      </span>
    </div>
  );
};

const NotAnsweredResponse = ({ wasAddedLater }: NotAnsweredResponseProps) => {
  return (
    <div className="flex items-center gap-2">
      <p className={cn("text-base italic text-muted-fg")}>
        {wasAddedLater
          ? "Question added after response completion"
          : "Not answered"}
      </p>
    </div>
  );
};

const isQuestionAddedLater = (
  surveyTemplateUpdatedAt: string,
  responseCompletedAt: string | null,
): boolean => {
  if (!responseCompletedAt) return false;

  const templateUpdated = new Date(surveyTemplateUpdatedAt);
  const responseCompleted = new Date(responseCompletedAt);

  return templateUpdated > responseCompleted;
};

export const SurveyTemplateResponseAnswers = ({
  surveyResponseId,
  surveyTemplateId,
}: SurveyResponseAnswersProps) => {
  const [
    { data: surveyTemplate, isPending: isSurveyTemplatePending },
    { data: surveyResponseAnswers, isPending: isSurveyResponseAnswersPending },
  ] = useQueries({
    queries: [
      surveyTemplateByIdQueryOptions(surveyTemplateId),
      surveyTemplateResponseAnswersQueryOptions({
        surveyResponseId,
        surveyTemplateId,
      }),
    ],
  });

  if (isSurveyTemplatePending || isSurveyResponseAnswersPending) {
    return null;
  }

  if (!surveyTemplate || !surveyResponseAnswers) {
    return (
      <div className="p-4 text-center text-muted-fg italic">
        <p>No responses found</p>
      </div>
    );
  }

  const answersByQuestionId = new Map(
    surveyResponseAnswers.answers.map((answer) => [
      answer.question?.id,
      answer,
    ]),
  );

  return (
    <div className="p-4 space-y-4">
      {surveyTemplate.questions.map((question, index) => {
        const answer = answersByQuestionId.get(question.id);
        const hasAnswer = answer && validateAnswer(question.type, answer.value);
        const wasQuestionAddedLater =
          !hasAnswer &&
          isQuestionAddedLater(
            surveyTemplate.updatedAt,
            surveyResponseAnswers.completedAt,
          );

        return (
          <div
            key={`question-answer-${question.id}`}
            className="flex items-start gap-4"
          >
            <QuestionTypeBadge type={question.type} label={`${index + 1}`} />

            {!hasAnswer ? (
              <NotAnsweredResponse wasAddedLater={wasQuestionAddedLater} />
            ) : (
              <>
                {question.type === "text" && (
                  <p className="text-base leading-relaxed">{answer.value}</p>
                )}

                {question.type === "rating" && (
                  <RatingStars rating={Number.parseInt(answer.value, 10)} />
                )}

                {question.type === "boolean" && (
                  <BooleanResponse value={answer.value} />
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
