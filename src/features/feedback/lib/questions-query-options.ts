import { queryOptions } from "@tanstack/react-query";
import type { getQuestionsUseCase } from "../use-cases/feedback.use-case";
import type {
  getQuestionAnswersUseCase,
  getQuestionByIdUseCase,
} from "../use-cases/questions.use-case";
import { GetQuestionsSchema, type SortBy } from "./questions.schema";

export const questionQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["question", id],
    queryFn: async () => {
      const response = await fetch(`/api/questions/${id}`);
      const json = (await response.json()) as Awaited<
        ReturnType<typeof getQuestionByIdUseCase>
      >;

      return json;
    },
  });

export const questionAnswersQueryOptions = (
  id: number,
  dateFrom?: Date,
  dateTo?: Date,
) => {
  const params = new URLSearchParams();
  if (dateFrom) params.set("dateFrom", dateFrom.toISOString());
  if (dateTo) params.set("dateTo", dateTo.toISOString());

  const queryString = params.toString();
  const url = `/api/questions/${id}/answers${queryString ? `?${queryString}` : ""}`;

  return {
    queryKey: [
      "question",
      id,
      "answers",
      dateFrom?.toISOString(),
      dateTo?.toISOString(),
    ],
    queryFn: async () => {
      const response = await fetch(url);
      const json = (await response.json()) as Awaited<
        ReturnType<typeof getQuestionAnswersUseCase>
      >;

      return json;
    },
  };
};

export const questionsQueryOptions = ({
  page = 1,
  pageSize = 10,
  sortBy = "alphabetical",
  q = "",
}: {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy;
  q?: string;
}) =>
  queryOptions({
    queryKey: ["feedback", "questions", page, pageSize, sortBy, q],
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

      const params = new URLSearchParams({
        page: validatedParams.page.toString(),
        pageSize: validatedParams.pageSize.toString(),
        sortBy: validatedParams.sortBy,
        q: validatedParams.q || "",
      });

      const response = await fetch(`/api/questions?${params.toString()}`, {
        method: "GET",
      });

      const json = (await response.json()) as Awaited<
        ReturnType<typeof getQuestionsUseCase>
      >;

      return json;
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
