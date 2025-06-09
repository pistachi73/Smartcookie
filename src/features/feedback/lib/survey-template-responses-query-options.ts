import type {
  getSurveyResponseAnswers,
  getSurveyTemplateResponses,
} from "@/data-access/survey-response/queries";
import { queryOptions } from "@tanstack/react-query";

export const surveyTemplateResponsesQueryOptions = (surveyTemplateId: number) =>
  queryOptions({
    queryKey: ["survey-template-responses", surveyTemplateId],
    queryFn: async () => {
      const response = await fetch(
        `/api/survey-templates/${surveyTemplateId}/responses`,
      );
      const json = (await response.json()) as Awaited<
        ReturnType<typeof getSurveyTemplateResponses>
      >;
      return json;
    },
    enabled: !!surveyTemplateId,
  });

export const surveyTemplateResponseAnswersQueryOptions = ({
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
        ReturnType<typeof getSurveyResponseAnswers>
      >;

      return json;
    },
    enabled: !!surveyResponseId && !!surveyTemplateId,
  });
};
