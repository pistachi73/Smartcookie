"use client";

import { Separator } from "@/shared/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React from "react";
import { questionsQueryOptions } from "../../lib/questions-query-options";
import type { SortBy } from "../../lib/questions.schema";
import { SidebarPanel } from "../sidebar-panel";
import { QuestionListItem } from "./question-list-item";
import { SkeletonQuestionListItem } from "./skeleton-question-list-item";

export const QuestionsPanel = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const sortBy: SortBy =
    (searchParams.get("sortBy") as SortBy) || "alphabetical";
  const q = searchParams.get("q") || "";

  // Guard against invalid page numbers from URL
  const validPage = Number.isInteger(page) && page > 0 ? page : 1;

  const { data, isLoading, isPlaceholderData, isFetching } = useQuery(
    questionsQueryOptions({
      page: validPage,
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
