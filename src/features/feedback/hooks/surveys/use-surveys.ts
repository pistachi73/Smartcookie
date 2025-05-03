import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import type { SortBy } from "../../lib/questions.schema";
import { getSurveysUseCase } from "../../use-cases/surveys.use-case";

type UseSurveysProps = {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy;
  q?: string;
};

export const useSurveys = ({
  page = 1,
  pageSize = 10,
  sortBy = "alphabetical",
  q = "",
}: UseSurveysProps) => {
  const user = useCurrentUser();

  const result = useQuery({
    queryKey: ["feedback", "surveys", user!.id, page, pageSize, sortBy, q],
    queryFn: async () => {
      const result = await getSurveysUseCase({ page, pageSize, sortBy, q });
      return result;
    },
    placeholderData: (previousData) => {
      if (!previousData) return undefined;

      // When data exists but we're changing pages, we want to show a loading state
      // for the questions list while preserving the metadata
      return {
        // Empty the surveys array to indicate loading during pagination
        surveys: [],
        page,
        pageSize,
        totalPages: previousData.totalPages,
        totalCount: previousData.totalCount,
      };
    },
  });

  return {
    ...result,
    // Show loading state for initial load or when data is placeholder
    isLoadingSurveys: result.isLoading || result.isPlaceholderData,
    // For cases where you explicitly want to know about background updates
    // that aren't showing a loading state
    isRefetchingSurveys:
      !result.isLoading && !result.isPlaceholderData && result.isFetching,
  };
};
