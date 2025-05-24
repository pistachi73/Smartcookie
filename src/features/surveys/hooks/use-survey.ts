import { useQuery } from "@tanstack/react-query";
import { getSurveyByIdUseCase } from "../use-cases/surveys.use-case";

export const getSurveyByIdQueryOptions = (surveyId: string) => {
  return {
    queryKey: ["survey", surveyId],
    queryFn: () => getSurveyByIdUseCase({ surveyId }),
  };
};

export const useSurvey = (surveyId: string) => {
  return useQuery(getSurveyByIdQueryOptions(surveyId));
};
