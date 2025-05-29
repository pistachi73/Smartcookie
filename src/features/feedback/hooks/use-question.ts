import { useQueries, useQuery } from "@tanstack/react-query";
import type {
  getQuestionAnswersUseCase,
  getQuestionByIdUseCase,
} from "../use-cases/questions.use-case";

export const getQuestionQueryOptions = (id: number) => ({
  queryKey: ["question", id],
  queryFn: async () => {
    const response = await fetch(`/api/questions/${id}`);
    const json = (await response.json()) as Awaited<
      ReturnType<typeof getQuestionByIdUseCase>
    >;

    return json;
  },
});

export const getQuestionAnswersQueryOptions = (
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

export const useQuestionWithAnswers = (
  id: number,
  dateFrom?: Date,
  dateTo?: Date,
) => {
  return useQueries({
    queries: [
      getQuestionQueryOptions(id),
      getQuestionAnswersQueryOptions(id, dateFrom, dateTo),
    ],
  });
};

export const useQuestion = (id: number) => {
  return useQuery(getQuestionQueryOptions(id));
};
