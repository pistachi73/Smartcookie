import { queryOptions } from "@tanstack/react-query";

import {
  getSurveyTemplateResponseAnswers,
  getSurveyTemplateResponses,
} from "@/data-access/survey-response/queries";

export const surveyTemplateResponsesQueryOptions = (surveyTemplateId: number) =>
  queryOptions({
    queryKey: ["survey-template-responses", surveyTemplateId],
    queryFn: () => getSurveyTemplateResponses({ surveyTemplateId }),
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
    queryFn: () => getSurveyTemplateResponseAnswers({ surveyResponseId }),
    enabled: !!surveyResponseId && !!surveyTemplateId,
  });
};
