import { queryOptions } from "@tanstack/react-query";
import type { z } from "zod";

import type {
  getSurveyTemplateById,
  getSurveyTemplates,
} from "@/data-access/survey-templates/queries";
import { GetSurveyTemplatesSchema } from "@/data-access/survey-templates/schemas";

export type GetSurveyTemplatesQueryResponse = Awaited<
  ReturnType<typeof getSurveyTemplates>
>;

export const getSurveyTemplatesQueryOptions = ({
  page = 1,
  pageSize = 10,
  sortBy = "alphabetical",
  q = "",
}: Partial<z.infer<typeof GetSurveyTemplatesSchema>>) =>
  queryOptions({
    queryKey: ["feedback", "survey-templates", page, pageSize, sortBy, q],
    queryFn: async () => {
      // Validate parameters before making the API call
      const validationResult = GetSurveyTemplatesSchema.safeParse({
        page,
        pageSize,
        sortBy,
        q,
      });

      if (!validationResult.success) {
        return {
          surveyTemplates: [],
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
      const result = (await response.json()) as GetSurveyTemplatesQueryResponse;
      return result;
    },
    placeholderData: (previousData) => {
      if (!previousData) return undefined;

      return {
        surveyTemplates: [],
        page,
        pageSize,
        totalPages: previousData.totalPages,
        totalCount: previousData.totalCount,
      };
    },
  });

export const surveyTemplateByIdQueryOptions = (surveyTemplateId: number) =>
  queryOptions({
    queryKey: ["survey-template", surveyTemplateId],
    queryFn: async () => {
      const response = await fetch(`/api/survey-templates/${surveyTemplateId}`);
      const json = (await response.json()) as Awaited<
        ReturnType<typeof getSurveyTemplateById>
      >;

      return json;
    },
    enabled: !!surveyTemplateId,
  });
