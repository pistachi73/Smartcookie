import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getSurveysByHubIdQueryOptions } from "../../lib/hub-surveys-query-options";
import { SurveyListItem } from "./survey-list-item";

export function SurveysList({ hubId }: { hubId: number }) {
  const { data: surveys } = useQuery(getSurveysByHubIdQueryOptions(hubId));
  const [openSurveyId, setOpenSurveyId] = useState<string | null>(null);

  if (!surveys) {
    return null;
  }

  const handleToggle = (surveyId: string) => {
    setOpenSurveyId((prev) => (prev === surveyId ? null : surveyId));
  };

  return (
    <div className="space-y-3">
      {surveys.map((survey) => (
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
