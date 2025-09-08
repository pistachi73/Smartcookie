import { queryOptions } from "@tanstack/react-query";
import type { z } from "zod";

import { getQuestionAnswers } from "@/data-access/answers/queries";
import { getQuestionById, getQuestions } from "@/data-access/questions/queries";
import { GetQuestionsSchema } from "@/data-access/questions/schemas";

export const questionQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["question", id],
    queryFn: () => getQuestionById({ id }),
  });

export const questionAnswersQueryOptions = (
  id: number,
  dateFrom?: Date,
  dateTo?: Date,
) =>
  queryOptions({
    queryKey: [
      "question",
      id,
      "answers",
      dateFrom?.toISOString(),
      dateTo?.toISOString(),
    ],
    queryFn: () => getQuestionAnswers({ id, dateFrom, dateTo }),
  });

export const questionsQueryOptions = ({
  page = 1,
  pageSize = 10,
  sortBy = "alphabetical",
  q = "",
}: Partial<z.infer<typeof GetQuestionsSchema>>) =>
  queryOptions({
    queryKey: ["feedback", "questions", { page, pageSize, sortBy, q }],
    queryFn: async () => {
      // Validate parameters before making the API call
      const validationResult = GetQuestionsSchema.safeParse({
        page,
        pageSize,
        sortBy,
        q,
      });

      if (!validationResult.success) {
        return {
          questions: [],
          totalCount: 0,
          page,
          pageSize,
          totalPages: 1,
        };
      }

      const validatedParams = validationResult.data;

      return getQuestions({
        page: validatedParams.page,
        pageSize: validatedParams.pageSize,
        sortBy: validatedParams.sortBy,
        q: validatedParams.q,
      });
    },
    placeholderData: (previousData) => {
      if (!previousData) return undefined;

      return {
        questions: [],
        page,
        pageSize,
        totalPages: previousData?.totalPages,
        totalCount: previousData?.totalCount,
      };
    },
  });
