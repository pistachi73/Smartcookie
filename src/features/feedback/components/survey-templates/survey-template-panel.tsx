"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { surveyTemplatesQueryOptions } from "../../lib/survey-template-query-options";
import { validateSearchParams } from "../../lib/validate-search-params";
import { SkeletonQuestionListItem } from "../questions/skeleton-question-list-item";
import { SidebarPanel } from "../sidebar-panel";
import { SurveyTemplateListItem } from "./survey-template-list-item";

export const SurveyTemplatesPanel = () => {
  const searchParams = useSearchParams();

  const { page, sortBy, q } = validateSearchParams(searchParams);

  const { data, isLoading, isPlaceholderData } = useQuery(
    surveyTemplatesQueryOptions({
      page,
      sortBy,
      q,
    }),
  );

  const isLoadingSurveys = isLoading || isPlaceholderData;

  const surveyTemplates = data?.surveyTemplates || [];
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
      ) : surveyTemplates.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-fg">No surveys found</p>
        </div>
      ) : (
        surveyTemplates.map((surveyTemplate) => (
          <SurveyTemplateListItem
            key={`survey-template-${surveyTemplate.id}`}
            surveyTemplate={surveyTemplate}
          />
        ))
      )}
    </SidebarPanel>
  );
};
