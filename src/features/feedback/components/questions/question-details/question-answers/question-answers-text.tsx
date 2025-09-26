import { TextIcon } from "@hugeicons-pro/core-stroke-rounded";

import { Heading } from "@/shared/components/ui/heading";

import type { Answer } from "../../../../types/answer.types";
import { QuestionNoAnswers } from "./question-no-answers";
import { DataCard, ResponseCard } from "./shared-cards";

type QuestionAnswersTextProps = {
  answers: Answer[];
};
const getTestWords = (answer: string) => {
  return answer.trim().split(" ").length;
};

export const QuestionAnswersText = ({ answers }: QuestionAnswersTextProps) => {
  // Filter valid text answers (non-empty) and ensure surveyResponse exists
  const validAnswers = answers.filter((answer) => {
    return answer.value.trim().length > 0;
  });

  if (validAnswers.length === 0) {
    return <QuestionNoAnswers type="text" />;
  }

  const averageLength = Math.round(
    validAnswers.reduce((sum, answer) => sum + getTestWords(answer.value), 0) /
      validAnswers.length,
  );

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResponseCard totalResponses={validAnswers.length} />
        <DataCard
          iconProps={{
            icon: TextIcon,
          }}
          label="Average Length"
          value={
            <>
              {averageLength}
              <span className="text-sm font-normal text-muted-fg"> words</span>
            </>
          }
          className={{
            icon: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
          }}
        />
      </div>

      {/* Answers List */}
      <div className="space-y-4">
        <Heading level={3}>Responses</Heading>
        <div className="space-y-2">
          {validAnswers.map((answer) => (
            <div
              key={`text-answer-${answer.id}`}
              className="border rounded-lg p-4 py-3 hover:border-border-hover transition-colors flex items-start justify-between gap-3"
            >
              <p className="flex-1 first-letter:uppercase">{answer.value}</p>
              <span className="text-xs text-muted-fg bg-muted px-2 py-1 rounded-md shrink-0">
                {getTestWords(answer.value)} words
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
