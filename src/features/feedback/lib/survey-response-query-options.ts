import { queryOptions } from "@tanstack/react-query";
import { getSurveyResponseAnswersUseCase } from "../use-cases/survey-templates.use-case";

export const surveyResponseAnswersQueryOptions = ({
  surveyResponseId,
  studentId,
}: {
  surveyResponseId: number;
  studentId: number;
}) => {
  return queryOptions({
    queryKey: ["survey-response", surveyResponseId, studentId],
    queryFn: () =>
      getSurveyResponseAnswersUseCase({ surveyResponseId, studentId }),
    enabled: !!surveyResponseId && !!studentId,
  });
};
