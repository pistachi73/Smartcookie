import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getSurveysByHubIdQueryOptions } from "../../lib/hub-surveys-query-options";
import { SkeletonSurveyListItem } from "./skeleton-survey-list-item";
import { SurveyListItem } from "./survey-list-item";

export function SurveysList({ hubId }: { hubId: number }) {
  const { data: surveys, isLoading } = useQuery(
    getSurveysByHubIdQueryOptions(hubId),
  );
  const [openSurveyId, setOpenSurveyId] = useState<string | null>(null);

  const handleToggle = (surveyId: string) => {
    setOpenSurveyId((prev) => (prev === surveyId ? null : surveyId));
  };

  return (
    <div className="space-y-3">
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <SkeletonSurveyListItem
              key={`skeleton-survey-list-item-${index}`}
            />
          ))
        : surveys?.map((survey) => (
            <SurveyListItem
              key={`survey-${survey.id}`}
              selectedSurveyId={openSurveyId}
              survey={survey}
              handleToggle={() => {
                handleToggle(survey.id);
              }}
              hubId={hubId}
            />
          ))}
    </div>
  );
}
