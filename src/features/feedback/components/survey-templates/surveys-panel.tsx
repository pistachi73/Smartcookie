"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import type { SortBy } from "../../lib/questions.schema";
import { surveysQueryOptions } from "../../lib/survey-template-query-options";
import { SkeletonQuestionListItem } from "../questions/skeleton-question-list-item";
import { SidebarPanel } from "../sidebar-panel";
import { SurveyListItem } from "./survey-list-item";

export const SurveysPanel = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const sortBy: SortBy =
    (searchParams.get("sortBy") as SortBy) || "alphabetical";
  const q = searchParams.get("q") || "";

  // Guard against invalid page numbers from URL
  const validPage = Number.isInteger(page) && page > 0 ? page : 1;

  const { data, isLoading, isPlaceholderData } = useQuery(
    surveysQueryOptions({
      page: validPage,
      sortBy,
      q,
    }),
  );

  const isLoadingSurveys = isLoading || isPlaceholderData;

  const surveys = data?.surveys || [];
  const totalSurveys = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <SidebarPanel
      panel="surveys"
      isLoading={isLoadingSurveys}
      totalItems={totalSurveys}
      totalPages={totalPages}
    >
      {isLoadingSurveys ? (
        Array.from({ length: 8 }).map((_, index) => (
          <SkeletonQuestionListItem
            key={`skeleton-question-list-item-${index}`}
          />
        ))
      ) : surveys.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-fg">No surveys found</p>
        </div>
      ) : (
        surveys.map((survey) => (
          <SurveyListItem key={`survey-${survey.id}`} survey={survey} />
        ))
      )}
    </SidebarPanel>
  );
};
