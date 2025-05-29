import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import type { SortBy } from "../lib/questions.schema";
import { GetQuestionsSchema } from "../lib/questions.schema";
import type { getQuestionsUseCase } from "../use-cases/feedback.use-case";

type UseQuestionsProps = {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy;
  q?: string;
};

export const useQuestions = ({
  page = 1,
  pageSize = 10,
  sortBy = "alphabetical",
  q = "",
}: UseQuestionsProps) => {
  const user = useCurrentUser();

  const result = useQuery({
    queryKey: ["feedback", "questions", user!.id, page, pageSize, sortBy, q],
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

      // When data exists but we're changing pages, we want to show a loading state
      // for the questions list while preserving the metadata
      return {
        // Empty the questions array to indicate loading during pagination
        questions: [],
        page,
        pageSize,
        totalPages: previousData?.totalPages,
        totalCount: previousData?.totalCount,
      };
    },
  });

  return {
    ...result,
    // Show loading state for initial load or when data is placeholder
    isLoadingQuestions: result.isLoading || result.isPlaceholderData,
    // For cases where you explicitly want to know about background updates
    // that aren't showing a loading state
    isRefetchingQuestions:
      !result.isLoading && !result.isPlaceholderData && result.isFetching,
  };
};
