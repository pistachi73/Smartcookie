import { cn } from "@/shared/lib/classes";
import {
  ThumbsDownIcon as ThumbsDownIconSolid,
  ThumbsUpIcon as ThumbsUpIconSolid,
  UserMultiple03Icon,
} from "@hugeicons-pro/core-solid-rounded";
import {
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import type { getQuestionByIdUseCase } from "../../use-cases/questions.use-case";

type Answer = NonNullable<
  Awaited<ReturnType<typeof getQuestionByIdUseCase>>
>["answers"][number];

type QuestionAnswersBooleanProps = {
  answers: Answer[];
};

export const QuestionAnswersBoolean = ({
  answers,
}: QuestionAnswersBooleanProps) => {
  // Filter valid boolean answers and ensure surveyResponse exists
  const validAnswers = answers.filter((answer) => {
    return (
      (answer.value === "true" || answer.value === "false") &&
      answer.surveyResponse
    );
  });

  if (validAnswers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
          <div className="relative size-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
            <div className="flex gap-1">
              <HugeiconsIcon
                icon={ThumbsUpIcon}
                size={16}
                className="text-green-600 dark:text-green-400"
              />
              <HugeiconsIcon
                icon={ThumbsDownIcon}
                size={16}
                className="text-red-600 dark:text-red-400"
              />
            </div>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">No responses yet</h3>
        <p className="text-sm text-muted-fg">Waiting for yes/no responses!</p>
      </div>
    );
  }

  const yesAnswers = validAnswers.filter((answer) => answer.value === "true");
  const noAnswers = validAnswers.filter((answer) => answer.value === "false");
  const totalResponses = validAnswers.length;
  const yesPercentage = Math.round((yesAnswers.length / totalResponses) * 100);
  const noPercentage = Math.round((noAnswers.length / totalResponses) * 100);
  const maxAnswers = Math.max(yesAnswers.length, noAnswers.length);

  const isYesMajority = yesAnswers.length > noAnswers.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-xl p-4 bg-overlay">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-lg",
                isYesMajority ? "bg-success/10" : "bg-danger/10",
              )}
            >
              <HugeiconsIcon
                icon={ThumbsUpIconSolid}
                altIcon={ThumbsDownIconSolid}
                showAlt={!isYesMajority}
                size={20}
                className={cn(isYesMajority ? "text-success" : "text-danger")}
              />
            </div>
            <div>
              <p className="text-sm text-muted-fg">Majority</p>
              <p className="text-2xl font-bold">
                {isYesMajority ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        <div className=" border rounded-xl p-4 bg-overlay">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-tint dark:bg-yellow-900/30 rounded-lg">
              <HugeiconsIcon
                icon={UserMultiple03Icon}
                size={20}
                className="text-primary"
              />
            </div>
            <div>
              <p className="text-sm text-muted-fg">Total Responses</p>
              <p className="text-2xl font-bold">{totalResponses}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-success/10 border border-success flex-1 flex flex-col justify-between rounded-xl p-4">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-fg">POSITIVE</p>
                <p className="text-3xl font-bold">{yesAnswers.length}</p>
              </div>
              <p className="text-5xl font-semibold text-success">
                {yesPercentage}
                <span className="text-sm font-medium">%</span>
              </p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-success/20 rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${yesPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-danger/10 border border-danger flex-1 flex flex-col justify-between rounded-xl p-4">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-fg">NEGATIVE</p>
                <p className="text-3xl font-bold">{noAnswers.length}</p>
              </div>
              <p className="text-5xl font-semibold text-danger">
                {noPercentage}
                <span className="text-sm font-medium">%</span>
              </p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-danger/20 rounded-full h-2">
                <div
                  className="bg-danger h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${noPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
