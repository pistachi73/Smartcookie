import type { getSurveyResponsesBySurveyId } from "@/data-access/survey-response/queries";
import type { getSurveysByHubId } from "@/data-access/surveys/queries";
import { queryOptions } from "@tanstack/react-query";

export type GetSurveysByHubIdQueryResponse = Awaited<
  ReturnType<typeof getSurveysByHubId>
>;

export const getSurveysByHubIdQueryOptions = (hubId: number) =>
  queryOptions({
    queryKey: ["hub-surveys", hubId],
    queryFn: async (): Promise<GetSurveysByHubIdQueryResponse> => {
      const response = await fetch(`/api/hubs/${hubId}/surveys`, {
        method: "GET",
      });

      return (await response.json()) as GetSurveysByHubIdQueryResponse;
    },
    enabled: !!hubId,
  });

export type GetSurveyResponsesBySurveyIdQueryResponse = Awaited<
  ReturnType<typeof getSurveyResponsesBySurveyId>
>;

export const getSurveyResponsesBySurveyIdQueryOptions = (surveyId: string) =>
  queryOptions({
    queryKey: ["survey-responses", surveyId],
    queryFn: async (): Promise<GetSurveyResponsesBySurveyIdQueryResponse> => {
      const response = await fetch(`/api/surveys/${surveyId}/responses`, {
        method: "GET",
      });

      return (await response.json()) as GetSurveyResponsesBySurveyIdQueryResponse;
    },
    enabled: !!surveyId,
  });
