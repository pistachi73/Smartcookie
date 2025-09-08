import { queryOptions } from "@tanstack/react-query";
import type { z } from "zod";

import {
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

      return getSurveyTemplates({
        page: validatedParams.page,
        pageSize: validatedParams.pageSize,
        sortBy: validatedParams.sortBy,
        q: validatedParams.q,
      });
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
    queryFn: () => getSurveyTemplateById({ id: surveyTemplateId }),
    enabled: !!surveyTemplateId,
  });
