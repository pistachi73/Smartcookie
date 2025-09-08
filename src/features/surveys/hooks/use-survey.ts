import { useQuery } from "@tanstack/react-query";

import { getSurveyByIdQueryOptions } from "../lib/survey-query-options";

export const useSurvey = (surveyId: string) => {
  return useQuery(getSurveyByIdQueryOptions(surveyId));
};
