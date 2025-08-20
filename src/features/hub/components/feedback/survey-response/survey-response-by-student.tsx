import { HugeiconsIcon } from "@hugeicons/react";
import {
  StarIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { Badge } from "@/shared/components/ui/badge";
import { Heading } from "@/shared/components/ui/heading";
import { StudentProfile } from "@/shared/components/students/student-profile";
import { cn } from "@/shared/lib/classes";

import type { QuestionType } from "@/db/schema";
import { QuestionTypeBadge } from "@/features/feedback/components/questions/question-type-badge";
import { getSurveyResponsesBySurveyIdQueryOptions } from "@/features/hub/lib/hub-surveys-query-options";
import type { GetSurveysByHubIdQueryResponse } from "../../../lib/hub-surveys-query-options";
import { SurveyNoResponses } from "./survey-no-responses";

interface StudentWithResponses {
  id: number;
  name: string;
  email: string;
  image: string | null;
  completedAt: string | null;
  responseId: number;
  answers: Array<{
    questionId: number;
    questionTitle: string;
    questionType: QuestionType;
    answer: string;
    questionOrder: number;
  }>;
}

const RatingDisplay = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 10 }, (_, i) => (
        <HugeiconsIcon
          key={i}
          icon={StarIcon}
          size={14}
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

const QuestionAnswer = ({
  answer,
  questionOrder,
}: {
  answer: StudentWithResponses["answers"][0];
  questionOrder: number;
}) => {
  const isNotAnswered = answer.answer === "Not answered";

  return (
    <div className="flex items-start gap-3">
      <QuestionTypeBadge
        type={answer.questionType}
        label={`${questionOrder}`}
      />

      <div className="flex-1 min-w-0 space-y-2">
        <Heading level={4} className="text-sm font-medium">
          {answer.questionTitle}
        </Heading>

        {isNotAnswered ? (
          <p className="text-sm italic text-muted-fg">Not answered</p>
        ) : (
          <div>
            {answer.questionType === "text" && (
              <p className="text-sm leading-relaxed break-words">
                {answer.answer}
              </p>
            )}

            {answer.questionType === "rating" && (
              <RatingDisplay rating={Number.parseInt(answer.answer, 10)} />
            )}

            {answer.questionType === "boolean" && (
              <BooleanDisplay value={answer.answer} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const StudentResponseCard = ({
  student,
  surveyQuestions,
}: {
  student: StudentWithResponses;
  surveyQuestions: GetSurveysByHubIdQueryResponse[number]["surveyTemplate"]["questions"];
}) => {
  const answeredCount = student.answers.filter(
    (a) => a.answer !== "Not answered",
  ).length;
  const totalQuestions = surveyQuestions.length;
  const completionPercentage = Math.round(
    (answeredCount / totalQuestions) * 100,
  );

  return (
    <div className=" overflow-hidden space-y-4">
      <div className="flex items-center justify-between bg-muted/70 p-3 rounded-xl">
        <StudentProfile
          name={student.name}
          email={student.email}
          image={student.image}
          avatarSize="md"
        />

        <div className="hidden sm:block text-right space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {answeredCount}/{totalQuestions} answered
            </span>
            <Badge
              intent={
                completionPercentage === 100
                  ? "success"
                  : completionPercentage >= 50
                    ? "warning"
                    : "danger"
              }
            >
              {completionPercentage}%
            </Badge>
          </div>
          {student.completedAt && (
            <p className="text-xs text-muted-fg">
              Completed {format(student.completedAt, "MMM d, yyyy")}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 px-3">
        {student.answers.map((answer) => (
          <QuestionAnswer
            key={`${student.id}-${answer.questionId}`}
            answer={answer}
            questionOrder={answer.questionOrder}
          />
        ))}
      </div>
    </div>
  );
};

export const SurveyResponseByStudent = ({
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

  // Create a map of question details for quick lookup
  const questionMap = new Map(
    surveyQuestions.map((q, index) => [q.id, { ...q, order: index + 1 }]),
  );

  // Transform data to group by students
  const students: StudentWithResponses[] = data.map((response) => {
    // Create answers for all questions, marking missing ones as "Not answered"
    const answers = surveyQuestions.map((question) => {
      const studentAnswer = response.answers.find(
        (a) => a.questionId === question.id,
      );
      const questionDetails = questionMap.get(question.id)!;

      return {
        questionId: question.id,
        questionTitle: question.title,
        questionType: question.type,
        answer: studentAnswer?.value || "Not answered",
        questionOrder: questionDetails.order,
      };
    });

    return {
      id: response.student.id,
      name: response.student.name,
      email: response.student.email,
      image: response.student.image,
      completedAt: response.completedAt,
      responseId: response.id,
      answers,
    };
  });

  return (
    <div className="space-y-8">
      {students.map((student) => (
        <StudentResponseCard
          key={student.id}
          student={student}
          surveyQuestions={surveyQuestions}
        />
      ))}
    </div>
  );
};
