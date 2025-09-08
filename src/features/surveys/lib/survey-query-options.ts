import { queryOptions } from "@tanstack/react-query";

import { getSurveyById } from "@/data-access/surveys/queries";

export const getSurveyByIdQueryOptions = (surveyId: string) => {
  return queryOptions({
    queryKey: ["survey", surveyId],
    queryFn: () => getSurveyById({ surveyId }),
  });
};
