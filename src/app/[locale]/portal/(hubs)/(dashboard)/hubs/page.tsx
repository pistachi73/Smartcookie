import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";

import { getUserHubCountQueryOptions } from "@/shared/hooks/plan-limits/query-options/hub-count-query-options";
import { generatePortalMetadata } from "@/shared/lib/generate-metadata";
import { getQueryClient } from "@/shared/lib/get-query-client";

import { HubList } from "@/features/hub/components/hub-list";
import { getHubsByUserIdQueryOptions } from "@/features/hub/lib/hub-query-options";

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePortalMetadata({ namespace: "Metadata.Courses" });
};

const HubsPage = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(getHubsByUserIdQueryOptions);
  void queryClient.prefetchQuery(getUserHubCountQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HubList />
    </HydrationBoundary>
  );
};

export default HubsPage;
