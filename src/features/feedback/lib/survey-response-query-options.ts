import { queryOptions } from "@tanstack/react-query";
import type { getSurveyResponseAnswersUseCase } from "../use-cases/survey-templates.use-case";

export const surveyResponseAnswersQueryOptions = ({
  surveyResponseId,
  surveyTemplateId,
}: {
  surveyResponseId: number;
  surveyTemplateId: number;
}) => {
  return queryOptions({
    queryKey: ["survey-response-answers", surveyResponseId],
    queryFn: async () => {
      const response = await fetch(
        `/api/survey-templates/${surveyTemplateId}/responses/${surveyResponseId}/answers`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch survey response answers");
      }

      const json = (await response.json()) as Awaited<
        ReturnType<typeof getSurveyResponseAnswersUseCase>
      >;

      return json;
    },
    enabled: !!surveyResponseId && !!surveyTemplateId,
  });
};
