"use client";

import { Button } from "@/shared/components/ui/button";
import { DateRangePicker } from "@/shared/components/ui/date-range-picker";
import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/classes";
import { FilterIcon } from "@hugeicons-pro/core-solid-rounded";
import {
  ArrowLeft02Icon,
  ArrowUpIcon,
  ChartHistogramIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  type DateValue,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import type { RangeValue } from "@react-types/shared";
import { format } from "date-fns";
import * as motion from "motion/react-m";
import { useState } from "react";
import { useQuestionWithAnswers } from "../../../hooks/use-question";
import { QuestionLoading } from "../question-loading";
import { QuestionNotFound } from "../question-not-found";
import { QuestionTypeBadge } from "../question-type-badge";
import { QuestionAnswersBoolean } from "./question-answers/question-answers-boolean";
import { QuestionAnswersRating } from "./question-answers/question-answers-rating";
import { QuestionAnswersText } from "./question-answers/question-answers-text";

type QuestionDetailsProps = {
  questionId: number;
};

const getInitialDateRange = () => {
  const todayDate = today(getLocalTimeZone()).add({ days: 1 });
  const twoMonthsAgo = todayDate.subtract({ months: 2 });
  return {
    start: twoMonthsAgo,
    end: todayDate,
  };
};

export const QuestionDetails = ({ questionId }: QuestionDetailsProps) => {
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    getInitialDateRange,
  );

  const [appliedDateRange, setAppliedDateRange] =
    useState<RangeValue<DateValue> | null>(getInitialDateRange);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [questionQuery, answersQuery] = useQuestionWithAnswers(
    questionId,
    appliedDateRange?.start?.toDate(getLocalTimeZone()),
    appliedDateRange?.end?.toDate(getLocalTimeZone()),
  );

  const question = questionQuery.data;
  const answers = answersQuery.data;

  if (questionQuery.isLoading) {
    return <QuestionLoading />;
  }

  if (!question) {
    return <QuestionNotFound />;
  }

  const handleApplyFilters = () => {
    setAppliedDateRange(dateRange);
    setIsFiltersOpen(false); // Close filters after applying
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const hasUnappliedChanges =
    JSON.stringify(dateRange) !== JSON.stringify(appliedDateRange);

  const renderAnswersByType = () => {
    const safeAnswers = answers || [];
    switch (question.type) {
      case "rating":
        return <QuestionAnswersRating answers={safeAnswers} />;
      case "boolean":
        return <QuestionAnswersBoolean answers={safeAnswers} />;
      case "text":
        return <QuestionAnswersText answers={safeAnswers} />;
      default:
        return null;
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
              {question.totalAnswers}{" "}
              {question.totalAnswers === 1 ? "response" : "responses"}
            </p>
          </div>
        </section>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={ChartHistogramIcon}
                size={18}
                className="text-primary"
              />
              <Heading level={3}>Response Analytics</Heading>
            </div>

            {/* Filter Toggle Button */}
            <Button
              onPress={toggleFilters}
              intent="outline"
              size="small"
              className="flex items-center gap-2"
            >
              <HugeiconsIcon icon={FilterIcon} size={16} />
              Filters
              <HugeiconsIcon
                icon={ArrowUpIcon}
                className={cn(
                  "transition-transform duration-200",
                  isFiltersOpen && "rotate-180",
                )}
                size={16}
              />
            </Button>
          </div>

          {/* Date Range Indicator */}
          {appliedDateRange && (
            <div className="flex flex-col bg-bg justify-between border rounded-lg mb-4">
              <div className="text-sm text-muted-fg px-4 py-3">
                Showing responses from{" "}
                <span className="font-medium text-fg">
                  {format(
                    appliedDateRange.start.toDate(getLocalTimeZone()),
                    "MMM d, yyyy",
                  )}
                </span>{" "}
                to{" "}
                <span className="font-medium text-fg">
                  {format(
                    appliedDateRange.end.toDate(getLocalTimeZone()),
                    "MMM d, yyyy",
                  )}
                </span>
              </div>
              {/* Collapsible Filter Section */}
              {isFiltersOpen && <Separator />}
              {isFiltersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 px-4 py-3">
                    <div className="block text-sm font-medium text-fg mb-2">
                      Date Range{" "}
                      <span className="text-muted-fg font-normal">
                        (max 6 months)
                      </span>
                    </div>
                    <form
                      className="flex flex-row gap-2"
                      onSubmit={(e) => {
                        if (hasUnappliedChanges) {
                          e.preventDefault();
                          handleApplyFilters();
                        }
                      }}
                    >
                      <DateRangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        maxValue={today(getLocalTimeZone()).add({ days: 1 })}
                        className={{
                          fieldGroup: "w-fit bg-overlay",
                        }}
                        validate={(range) =>
                          range.end.compare(range.start) > 6 * 31
                            ? "Date range cannot exceed 6 months"
                            : null
                        }
                      />

                      <Button
                        type="submit"
                        intent="primary"
                        size="medium"
                        isDisabled={!hasUnappliedChanges}
                      >
                        Apply Filters
                      </Button>
                    </form>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        {answersQuery.isPending ? <QuestionLoading /> : renderAnswersByType()}
      </div>
    </div>
  );
};
