import { useQuery } from "@tanstack/react-query";
import { getHubSurveysUseCase } from "../../use-cases/feedback.use-case";

export const useHubSurveys = (hubId: number) => {
  return useQuery({
    queryKey: ["hub-surveys", hubId],
    queryFn: () => getHubSurveysUseCase({ hubId }),
  });
};
