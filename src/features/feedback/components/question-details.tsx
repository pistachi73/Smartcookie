"use client";

import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuestion } from "../hooks/use-question";
import { QuestionTypeBadge } from "./question-type-badge";

type QuestionDetailsProps = {
  questionId: number;
};

export const QuestionDetails = ({ questionId }: QuestionDetailsProps) => {
  const { data: question, isPending } = useQuestion(Number(questionId));

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (!question) {
    return <p>Question not found</p>;
  }

  return (
    <>
      <Link
        intent="secondary"
        href="/portal/feedback"
        className={"flex items-center gap-1.5 text-sm mb-6"}
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={18} data-slot="icon" />
        Back to hall
      </Link>
      <section className="flex flex-col gap-3">
        <Heading level={2} className="max-w-[42ch] text-balance">
          {question.title}
        </Heading>
        {question.description && (
          <p className="text-sm text-muted-fg">{question.description}</p>
        )}
        <div className="flex items-center gap-4">
          <QuestionTypeBadge label type={question.type} />

          <p className="text-sm text-muted-fg">
            {question.answerCount} responses
          </p>
        </div>
      </section>
    </>
  );
};
