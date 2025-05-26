import {
  StarIcon,
  UserMultiple03Icon,
} from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import type { getQuestionByIdUseCase } from "../../use-cases/questions.use-case";

type Answer = NonNullable<
  Awaited<ReturnType<typeof getQuestionByIdUseCase>>
>["answers"][number];

type QuestionAnswersRatingProps = {
  answers: Answer[];
};

export const QuestionAnswersRating = ({
  answers,
}: QuestionAnswersRatingProps) => {
  // Filter valid rating answers (1-10) and ensure surveyResponse exists
  const validAnswers = answers.filter((answer) => {
    const rating = Number.parseInt(answer.value, 10);
    return (
      !Number.isNaN(rating) &&
      rating >= 1 &&
      rating <= 10 &&
      answer.surveyResponse
    );
  });

  if (validAnswers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-2xl" />
          <div className="relative size-20 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mb-4">
            <HugeiconsIcon
              icon={StarIcon}
              size={32}
              className="text-amber-600 dark:text-amber-400"
            />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">No ratings yet</h3>
        <p className="text-sm text-muted-fg">
          Be the first to rate this question!
        </p>
      </div>
    );
  }

  // Calculate rating distribution
  const ratingCounts = Array.from({ length: 10 }, (_, i) => ({
    rating: i + 1,
    count: validAnswers.filter(
      (answer) => Number.parseInt(answer.value, 10) === i + 1,
    ).length,
  }));

  const maxCount = Math.max(...ratingCounts.map((r) => r.count));
  const totalResponses = validAnswers.length;
  const averageRating =
    validAnswers.reduce(
      (sum, answer) => sum + Number.parseInt(answer.value, 10),
      0,
    ) / totalResponses;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-xl p-4 bg-overlay">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <HugeiconsIcon
                icon={StarIcon}
                size={20}
                className="text-yellow-500 dark:text-yellow-400"
              />
            </div>
            <div>
              <p className="text-sm text-muted-fg">Average</p>
              <p className="text-2xl font-bold">
                {averageRating.toFixed(1)}
                <span className="text-sm text-muted-fg font-normal">/10</span>
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

      <div className="border rounded-2xl p-6 bg-overlay">
        <div className="space-y-4">
          {ratingCounts.reverse().map(({ rating, count }) => {
            const percentage =
              totalResponses > 0
                ? Math.round((count / totalResponses) * 100)
                : 0;

            return (
              <div className="flex flex-col gap-2" key={`rating-${rating}`}>
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium tabular-nums">
                      {rating}
                    </span>
                    <HugeiconsIcon
                      icon={StarIcon}
                      size={14}
                      className="text-yellow-500"
                    />
                  </div>
                  <p className="text-sm font-medium text-muted-fg">
                    {count} response{count !== 1 ? "s" : ""}{" "}
                    <span className="ml-0.5">({percentage}%)</span>
                  </p>
                </div>

                <div className="flex-1 relative">
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                      style={{
                        width:
                          maxCount > 0 ? `${(count / maxCount) * 100}%` : "0%",
                        animationDelay: `${(10 - rating) * 50}ms`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
