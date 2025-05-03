import { useQuery } from "@tanstack/react-query";
import type { getQuestionByIdUseCase } from "../use-cases/questions.use-case";

const getQuestionQueryOptions = (id: number) => ({
  queryKey: ["question", id],
  queryFn: async () => {
    const response = await fetch(`/api/questions/${id}`);
    const json = (await response.json()) as Awaited<
      ReturnType<typeof getQuestionByIdUseCase>
    >;

    return json;
  },
});

export const useQuestion = (id: number) => {
  return useQuery(getQuestionQueryOptions(id));
};
