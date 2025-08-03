import { HugeiconsIcon } from "@hugeicons/react";
import {
  StarIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";

import { Heading } from "@/shared/components/ui/heading";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { StudentProfile } from "@/shared/components/students/student-profile";
import { cn } from "@/shared/lib/classes";

import type { QuestionType } from "@/db/schema";
import { QuestionTypeBadge } from "@/features/feedback/components/questions/question-type-badge";
import {
  type GetSurveysByHubIdQueryResponse,
  getSurveyResponsesBySurveyIdQueryOptions,
} from "@/features/hub/lib/hub-surveys-query-options";
import { SurveyNoResponses } from "./survey-no-responses";

interface QuestionWithResponses {
  id: number;
  title: string;
  type: QuestionType;
  responses: Array<{
    studentId: number;
    studentName: string;
    studentEmail: string;
    studentImage: string | null;
    answer: string;
    responseId: number;
  }>;
}

const RatingDisplay = ({ rating }: { rating: number }) => {
  const down = useViewport();
  const isMobile = down.down("sm");
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: isMobile ? 1 : 10 }, (_, i) => (
        <HugeiconsIcon
          key={i}
          icon={StarIcon}
          size={14}
          className={cn(
            "transition-colors",
            i < rating || isMobile
              ? "text-yellow-500 fill-yellow-500"
              : "text-muted-fg",
          )}
        />
      ))}

      <span className="ml-1  sm:ml-2 text-sm font-medium text-muted-fg">
        {rating}/10
      </span>
    </div>
  );
};

const BooleanDisplay = ({ value }: { value: string }) => {
  const isTrue = value === "true";
  return (
    <div className="flex items-center gap-2">
      <HugeiconsIcon
        icon={isTrue ? ThumbsUpIcon : ThumbsDownIcon}
        size={16}
        className={cn(
          "transition-colors",
          isTrue ? "text-success" : "text-danger",
        )}
      />
      <span
        className={cn(
          "font-medium text-sm",
          isTrue ? "text-success" : "text-danger",
        )}
      >
        {isTrue ? "Yes" : "No"}
      </span>
    </div>
  );
};

const RatingSummary = ({
  responses,
}: {
  responses: QuestionWithResponses["responses"];
}) => {
  const validRatings = responses
    .filter((r) => r.answer !== "Not answered")
    .map((r) => Number.parseInt(r.answer, 10))
    .filter((rating) => !Number.isNaN(rating) && rating >= 1 && rating <= 10);

  if (validRatings.length === 0) return null;

  const average =
    validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-fg">Average:</span>
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold">{average.toFixed(1)}</span>
        <HugeiconsIcon
          icon={StarIcon}
          size={12}
          className={cn("transition-colors text-yellow-500 fill-yellow-500")}
        />
      </div>
    </div>
  );
};

const BooleanSummary = ({
  responses,
}: {
  responses: QuestionWithResponses["responses"];
}) => {
  const validResponses = responses.filter((r) => r.answer !== "Not answered");
  const yesCount = validResponses.filter((r) => r.answer === "true").length;
  const noCount = validResponses.filter((r) => r.answer === "false").length;
  const total = validResponses.length;

  if (total === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex items-center flex-col justify-between p-3 bg-success/10 rounded-lg">
        <p className="text-lg font-bold text-success">{yesCount}</p>
        <p className="flex items-center gap-2">
          <HugeiconsIcon
            icon={ThumbsUpIcon}
            size={16}
            className="text-success"
          />
          <span className="text-sm font-medium text-success">Yes</span>
        </p>
      </div>

      <div className="flex items-center flex-col justify-between p-3 bg-danger/10 rounded-lg">
        <p className="text-lg font-bold text-danger">{noCount}</p>
        <p className="flex items-center gap-2">
          <HugeiconsIcon
            icon={ThumbsDownIcon}
            size={16}
            className="text-danger"
          />
          <span className="text-sm font-medium text-danger">No</span>
        </p>
      </div>
    </div>
  );
};

const ResponseItem = ({
  response,
  questionType,
}: {
  response: QuestionWithResponses["responses"][0];
  questionType: QuestionWithResponses["type"];
}) => {
  const isNotAnswered = response.answer === "Not answered";

  return (
    <div className="flex items-center justify-between gap-4  p-3 bg-muted/70 rounded-lg hover:border-border-hover transition-colors">
      <StudentProfile
        name={response.studentName}
        image={response.studentImage}
        avatarSize="small"
        className="shrink-0"
      />

      <div className=" min-w-0">
        {isNotAnswered ? (
          <p className="text-sm italic text-muted-fg">Not answered</p>
        ) : (
          <div className="space-y-1">
            {questionType === "text" && (
              <p className="text-sm leading-relaxed break-words">
                {response.answer}
              </p>
            )}

            {questionType === "rating" && (
              <RatingDisplay rating={Number.parseInt(response.answer, 10)} />
            )}

            {questionType === "boolean" && (
              <BooleanDisplay value={response.answer} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const SurveyResponseByQuestion = ({
  surveyId,
  surveyQuestions,
}: {
  surveyId: string;
  surveyQuestions: GetSurveysByHubIdQueryResponse[number]["surveyTemplate"]["questions"];
}) => {
  const { data, isLoading } = useQuery({
    ...getSurveyResponsesBySurveyIdQueryOptions(surveyId),
    enabled: !!surveyId,
  });

  if (isLoading) return null;
  if (!data || data.length === 0) {
    return <SurveyNoResponses />;
  }

  // Create a map of responses by student and question for quick lookup
  const responseMap = new Map<string, string>();
  data.forEach((response) => {
    response.answers.forEach((answer) => {
      const key = `${response.student.id}-${answer.questionId}`;
      responseMap.set(key, answer.value);
    });
  });

  // Transform survey questions to include all responses in the correct order
  const questions: QuestionWithResponses[] = surveyQuestions.map(
    (surveyQuestion) => {
      const responses = data.map((response) => {
        const key = `${response.student.id}-${surveyQuestion.id}`;
        const answer = responseMap.get(key) || "Not answered";

        return {
          studentId: response.student.id,
          studentName: response.student.name,
          studentEmail: response.student.email,
          studentImage: response.student.image,
          answer,
          responseId: response.id,
        };
      });

      return {
        id: surveyQuestion.id,
        title: surveyQuestion.title,
        type: surveyQuestion.type,
        responses,
      };
    },
  );

  return (
    <div className="space-y-8">
      {questions.map((question, index) => (
        <div key={question.id} className="overflow-hidden space-y-4 flex gap-3">
          <QuestionTypeBadge type={question.type} label={`${index + 1}`} />

          <div className="space-y-4 flex-1">
            <Heading level={4} className="text-sm sm:text-base">
              {question.title}
            </Heading>
            <div className="space-y-2">
              {question.type === "rating" && (
                <RatingSummary responses={question.responses} />
              )}

              {question.type === "boolean" && (
                <BooleanSummary responses={question.responses} />
              )}

              {question.responses.map((response) => (
                <ResponseItem
                  key={`${question.id}-${response.responseId}`}
                  response={response}
                  questionType={question.type}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
