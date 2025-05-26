import { UserAvatar } from "@/shared/components/ui/user-avatar";
import { TextIcon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import type { getQuestionByIdUseCase } from "../../use-cases/questions.use-case";

type Answer = NonNullable<
  Awaited<ReturnType<typeof getQuestionByIdUseCase>>
>["answers"][number];

type QuestionAnswersTextProps = {
  answers: Answer[];
};

export const QuestionAnswersText = ({ answers }: QuestionAnswersTextProps) => {
  // Filter valid text answers (non-empty) and ensure surveyResponse exists
  const validAnswers = answers.filter((answer) => {
    return answer.value.trim().length > 0 && answer.surveyResponse;
  });

  if (validAnswers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl" />
          <div className="relative size-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-4">
            <HugeiconsIcon
              icon={TextIcon}
              size={32}
              className="text-blue-600 dark:text-blue-400"
            />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">No text responses yet</h3>
        <p className="text-sm text-muted-fg">Waiting for written feedback!</p>
      </div>
    );
  }

  const averageLength = Math.round(
    validAnswers.reduce((sum, answer) => sum + answer.value.length, 0) /
      validAnswers.length,
  );

  const shortResponses = validAnswers.filter(
    (answer) => answer.value.length <= 50,
  );
  const mediumResponses = validAnswers.filter(
    (answer) => answer.value.length > 50 && answer.value.length <= 150,
  );
  const longResponses = validAnswers.filter(
    (answer) => answer.value.length > 150,
  );

  return (
    <div className="space-y-8">
      {/* Text Summary */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-2xl" />
        <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Responses */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <HugeiconsIcon
                  icon={TextIcon}
                  size={16}
                  className="text-blue-500"
                />
                <span className="text-sm font-medium text-muted-fg">
                  Total Responses
                </span>
              </div>
              <div className="text-3xl font-bold text-foreground">
                {validAnswers.length}
              </div>
            </div>

            {/* Average Length */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="size-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-muted-fg">
                  Avg. Length
                </span>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {averageLength}
              </div>
              <div className="text-xs text-muted-fg">characters</div>
            </div>

            {/* Response Distribution */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="size-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-muted-fg">Short</span>
              </div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {shortResponses.length}
              </div>
              <div className="text-xs text-muted-fg">≤50 chars</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="size-2 bg-orange-500 rounded-full" />
                <span className="text-sm font-medium text-muted-fg">
                  Detailed
                </span>
              </div>
              <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {longResponses.length}
              </div>
              <div className="text-xs text-muted-fg">&gt;150 chars</div>
            </div>
          </div>

          {/* Response Length Distribution */}
          <div className="mt-6 space-y-3">
            <h5 className="text-sm font-medium text-muted-fg">
              Response Length Distribution
            </h5>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {shortResponses.length}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  Short (≤50)
                </div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200/50 dark:border-yellow-800/50">
                <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                  {mediumResponses.length}
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-400">
                  Medium (51-150)
                </div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
                <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
                  {longResponses.length}
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400">
                  Long (&gt;150)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Responses */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl" />
        <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
          <h4 className="font-semibold mb-6 flex items-center gap-2">
            <div className="size-1 bg-primary rounded-full" />
            Individual Responses
          </h4>

          <div className="space-y-6">
            {validAnswers.map((answer, index) => {
              const student = answer.surveyResponse!.student;
              const wordCount = answer.value.split(/\s+/).length;
              const responseLength = answer.value.length;

              const lengthCategory =
                responseLength <= 50
                  ? "short"
                  : responseLength <= 150
                    ? "medium"
                    : "long";

              return (
                <div
                  key={answer.id}
                  className="group relative overflow-hidden bg-background/60 backdrop-blur-sm border border-border/30 rounded-xl p-6 hover:border-border/60 transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          userImage={student.image}
                          userName={student.name}
                          size="medium"
                          className="ring-2 ring-background shadow-sm"
                        />
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-fg">
                            <span>{responseLength} characters</span>
                            <span>•</span>
                            <span>{wordCount} words</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className={`size-2 rounded-full ${
                            lengthCategory === "short"
                              ? "bg-green-500"
                              : lengthCategory === "medium"
                                ? "bg-yellow-500"
                                : "bg-orange-500"
                          }`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            lengthCategory === "short"
                              ? "text-green-600 dark:text-green-400"
                              : lengthCategory === "medium"
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-orange-600 dark:text-orange-400"
                          }`}
                        >
                          {lengthCategory}
                        </span>
                      </div>
                    </div>

                    {/* Response Content */}
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-primary/20 rounded-full" />
                      <blockquote className="pl-6 text-sm leading-relaxed text-foreground/90 italic">
                        "{answer.value}"
                      </blockquote>
                    </div>

                    {/* Additional Comment */}
                    {answer.additionalComment && (
                      <div className="mt-4 pt-4 border-t border-border/30">
                        <div className="flex items-start gap-2">
                          <div className="size-1.5 bg-muted-fg/50 rounded-full mt-2 shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-muted-fg mb-1">
                              Additional comment:
                            </p>
                            <p className="text-xs text-muted-fg leading-relaxed">
                              {answer.additionalComment}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
