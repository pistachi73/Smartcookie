"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React from "react";

import { Separator } from "@/shared/components/ui/separator";

import { questionsQueryOptions } from "../../lib/questions-query-options";
import { validateSearchParams } from "../../lib/validate-search-params";
import { SidebarPanel } from "../sidebar-panel";
import { QuestionListItem } from "./question-list-item";
import { SkeletonQuestionListItem } from "./skeleton-question-list-item";

export const QuestionsPanel = () => {
  const searchParams = useSearchParams();
  const { page, sortBy, q } = validateSearchParams(searchParams);

  const { data, isLoading, isPlaceholderData } = useQuery(
    questionsQueryOptions({
      page,
      sortBy,
      q,
    }),
  );

  const isLoadingQuestions = isLoading || isPlaceholderData;

  const questions = data?.questions || [];
  const totalQuestions = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <SidebarPanel
      panel="questions"
      isLoading={isLoading}
      totalItems={totalQuestions}
      totalPages={totalPages}
    >
      {isLoadingQuestions ? (
        Array.from({ length: 8 }).map((_, index) => (
          <SkeletonQuestionListItem
            key={`skeleton-question-list-item-${index}`}
          />
        ))
      ) : questions.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-fg">No questions found</p>
        </div>
      ) : (
        questions.map((question) => (
          <React.Fragment key={`question-${question.id}`}>
            <QuestionListItem
              key={`question-${question.id}`}
              question={question}
            />
            <Separator />
          </React.Fragment>
        ))
      )}
    </SidebarPanel>
  );
};
