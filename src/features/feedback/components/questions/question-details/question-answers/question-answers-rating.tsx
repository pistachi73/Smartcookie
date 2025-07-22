import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons-pro/core-solid-rounded";

import type { Answer } from "../../../../types/answer.types";
import { QuestionNoAnswers } from "./question-no-answers";
import { DataCard, ResponseCard } from "./shared-cards";

type QuestionAnswersRatingProps = {
  answers: Answer[];
};

export const QuestionAnswersRating = ({
  answers,
}: QuestionAnswersRatingProps) => {
  // Filter valid rating answers (1-10) and ensure surveyResponse exists
  const validAnswers = answers.filter((answer) => {
    const rating = Number.parseInt(answer.value, 10);
    return !Number.isNaN(rating) && rating >= 1 && rating <= 10;
  });

  if (validAnswers.length === 0) {
    return <QuestionNoAnswers type="rating" />;
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
        <ResponseCard totalResponses={totalResponses} />

        <DataCard
          iconProps={{
            icon: StarIcon,
          }}
          label="Average"
          value={
            <>
              {averageRating.toFixed(1)}
              <span className="text-sm text-muted-fg font-normal">/10</span>
            </>
          }
          className={{
            icon: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500",
          }}
        />
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
