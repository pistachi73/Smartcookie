import { cn } from "@/shared/lib/classes";
import {
  MinusSignIcon,
  ThumbsDownIcon as ThumbsDownIconSolid,
  ThumbsUpIcon as ThumbsUpIconSolid,
} from "@hugeicons-pro/core-solid-rounded";
import type { Answer } from "../../../../types/answer.types";
import { QuestionNoAnswers } from "./question-no-answers";
import { DataCard, ResponseCard } from "./shared-cards";

type QuestionAnswersBooleanProps = {
  answers: Answer[];
};

const getMajorityData = (yesCount: number, noCount: number) => {
  const isYesMajority = yesCount > noCount;
  const isTie = yesCount === noCount;

  const icon = isTie
    ? MinusSignIcon
    : isYesMajority
      ? ThumbsUpIconSolid
      : ThumbsDownIconSolid;
  const value = isTie ? "Tie" : isYesMajority ? "Yes" : "No";
  const iconClassName = isTie
    ? "bg-secondary text-secondary-fg"
    : isYesMajority
      ? "bg-success/10 text-success"
      : "bg-danger/10 text-danger";

  return { icon, value, iconClassName };
};

export const QuestionAnswersBoolean = ({
  answers,
}: QuestionAnswersBooleanProps) => {
  // Filter valid boolean answers and ensure surveyResponse exists
  const validAnswers = answers.filter((answer) => {
    return answer.value === "true" || answer.value === "false";
  });

  if (validAnswers.length === 0) {
    return <QuestionNoAnswers type="boolean" />;
  }

  const yesAnswers = validAnswers.filter((answer) => answer.value === "true");
  const noAnswers = validAnswers.filter((answer) => answer.value === "false");
  const totalResponses = validAnswers.length;
  const yesPercentage = Math.round((yesAnswers.length / totalResponses) * 100);
  const noPercentage = Math.round((noAnswers.length / totalResponses) * 100);

  const majorityData = getMajorityData(yesAnswers.length, noAnswers.length);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResponseCard totalResponses={totalResponses} />
        <DataCard
          iconProps={{
            icon: majorityData.icon,
          }}
          label="Majority"
          value={majorityData.value}
          className={{
            icon: majorityData.iconClassName,
          }}
        />
      </div>
      <div className="w-full flex gap-4">
        <BooleanCard
          value="true"
          percentage={yesPercentage}
          totalResponses={yesAnswers.length}
        />
        <BooleanCard
          value="false"
          percentage={noPercentage}
          totalResponses={noAnswers.length}
        />
      </div>
    </div>
  );
};

const BooleanCard = ({
  value,
  percentage,
  totalResponses,
}: {
  value: "true" | "false";
  percentage: number;
  totalResponses: number;
}) => {
  const label = value === "true" ? "POSITIVE" : "NEGATIVE";

  return (
    <div
      className={cn(
        "border flex-1 flex flex-col justify-between rounded-xl p-4 gap-4",
        value === "true"
          ? "bg-success/10 border-success/50"
          : "bg-danger/10 border-danger/50",
      )}
    >
      <p
        className={cn(
          "text-sm font-medium",
          value === "true" ? "text-success" : "text-danger",
        )}
      >
        {label}
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <p
            className={cn(
              "text-4xl font-bold",
              value === "true" ? "text-success" : "text-danger",
            )}
          >
            {totalResponses}
          </p>
          <p
            className={cn(
              "text-3xl font-semibold",
              value === "true" ? "text-success" : "text-danger",
            )}
          >
            {percentage}
            <span className="text-sm font-medium">%</span>
          </p>
        </div>

        <div
          className={cn(
            "w-full rounded-full h-1",
            value === "true" ? "bg-success/20" : "bg-danger/20",
          )}
        >
          <div
            className={cn(
              "h-1 rounded-full transition-all duration-500 ease-out",
              value === "true" ? "bg-success" : "bg-danger",
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
