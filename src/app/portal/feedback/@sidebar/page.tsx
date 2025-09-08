import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/shared/lib/get-query-client";

import type { SortBy } from "@/data-access/questions/schemas";
import { FeedbackSidebar } from "@/features/feedback/components/feedback-sidebar";
import { questionsQueryOptions } from "@/features/feedback/lib/questions-query-options";
import { getSurveyTemplatesQueryOptions } from "@/features/feedback/lib/survey-template-query-options";

export default async function SidebarPage(
  props: PageProps<"/portal/feedback">,
) {
  const queryClient = getQueryClient();
  const searchParams = await props.searchParams;

  const pageParam = searchParams?.page;
  const qParam = searchParams?.q;
  const sortByParam = searchParams?.sortBy;
  const tabParam = searchParams?.tab;

  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const page = Number(pageValue || "1");
  const sortByValue = Array.isArray(sortByParam) ? sortByParam[0] : sortByParam;

  const tabValue = Array.isArray(tabParam) ? tabParam[0] : tabParam;

  const validPage = Number.isInteger(page) && page > 0 ? page : 1;
  const validTab = tabValue || "questions";
  const validQ = Array.isArray(qParam) ? qParam[0] || "" : qParam || "";
  const validSortBy: SortBy =
    sortByValue === "alphabetical" ||
    sortByValue === "newest" ||
    sortByValue === "response-count"
      ? sortByValue
      : "alphabetical";

  if (validTab === "questions") {
    void queryClient.prefetchQuery(
      questionsQueryOptions({
        page: validPage,
        sortBy: validSortBy,
        q: validQ,
      }),
    );
  } else if (validTab === "surveys") {
    void queryClient.prefetchQuery(
      getSurveyTemplatesQueryOptions({
        page: validPage,
        sortBy: validSortBy,
        q: validQ,
      }),
    );
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <FeedbackSidebar />
    </HydrationBoundary>
  );
}
