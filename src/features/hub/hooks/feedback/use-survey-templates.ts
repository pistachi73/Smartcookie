import { useQuery } from "@tanstack/react-query";
import { getSurveyTemplatesUseCase } from "../../use-cases/feedback.use-case";

export const useSurveyTemplates = () => {
  return useQuery({
    queryKey: ["survey-templates"],
    queryFn: () => getSurveyTemplatesUseCase(),
  });
};
