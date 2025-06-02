import { queryOptions } from "@tanstack/react-query";
import type {
  getSurveyTemplateByIdUseCase,
  getSurveysUseCase,
} from "../use-cases/survey-templates.use-case";
import { getSurveyTemplateResponsesUseCase } from "../use-cases/survey-templates.use-case";
import type { SortBy } from "./questions.schema";
import { GetSurveysSchema } from "./surveys.schema";

type SurveysQueryOptionsProps = {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy;
  q?: string;
};

export const surveysQueryOptions = ({
  page = 1,
  pageSize = 10,
  sortBy = "alphabetical" as SortBy,
  q = "",
}: SurveysQueryOptionsProps) =>
  queryOptions({
    queryKey: ["feedback", "surveys", page, pageSize, sortBy, q],
    queryFn: async () => {
      // Validate parameters before making the API call
      const validationResult = GetSurveysSchema.safeParse({
        page,
        pageSize,
        sortBy,
        q,
      });

      if (!validationResult.success) {
        return {
          surveys: [],
          totalCount: 0,
          page,
          pageSize,
          totalPages: 1,
        };
      }

      const validatedParams = validationResult.data;

      const searchParams = new URLSearchParams({
        page: validatedParams.page.toString(),
        pageSize: validatedParams.pageSize.toString(),
        sortBy: validatedParams.sortBy,
        q: validatedParams.q || "",
      });

      const response = await fetch(`/api/survey-templates?${searchParams}`);
      const result = (await response.json()) as Awaited<
        ReturnType<typeof getSurveysUseCase>
      >;
      return result;
    },
    placeholderData: (previousData) => {
      if (!previousData) return undefined;

      return {
        surveys: [],
        page,
        pageSize,
        totalPages: previousData.totalPages,
        totalCount: previousData.totalCount,
      };
    },
  });

export const surveyTemplateByIdQueryOptions = (surveyTemplateId: number) => ({
  queryKey: ["survey-template", surveyTemplateId],
  queryFn: async () => {
    const response = await fetch(`/api/survey-templates/${surveyTemplateId}`);
    const json = (await response.json()) as Awaited<
      ReturnType<typeof getSurveyTemplateByIdUseCase>
    >;

    return json;
  },
  enabled: !!surveyTemplateId,
});

export const surveyTemplateResponsesQueryOptions = (surveyTemplateId: number) =>
  queryOptions({
    queryKey: ["survey-template-responses", surveyTemplateId],
    queryFn: () => getSurveyTemplateResponsesUseCase({ surveyTemplateId }),
    enabled: !!surveyTemplateId,
  });
