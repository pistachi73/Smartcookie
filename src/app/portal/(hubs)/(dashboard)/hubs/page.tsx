import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { HubList } from "@/features/hub/components/hub-list";
import { getHubsByUserIdQueryOptions } from "@/features/hub/lib/hub-query-options";

const HubsPage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    ...getHubsByUserIdQueryOptions(queryClient),
    staleTime: 1000 * 60 * 60 * 24,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HubList />
    </HydrationBoundary>
  );
};

export default HubsPage;
