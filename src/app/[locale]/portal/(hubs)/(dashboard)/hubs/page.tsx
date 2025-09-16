import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getUserHubCountQueryOptions } from "@/shared/hooks/plan-limits/query-options/hub-count-query-options";
import { getQueryClient } from "@/shared/lib/get-query-client";

import { HubList } from "@/features/hub/components/hub-list";
import { getHubsByUserIdQueryOptions } from "@/features/hub/lib/hub-query-options";

const HubsPage = async () => {
  const queryClient = getQueryClient();

  const hubs = await queryClient.fetchQuery(getHubsByUserIdQueryOptions);
  queryClient.setQueryData(getUserHubCountQueryOptions.queryKey, hubs.length);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HubList />
    </HydrationBoundary>
  );
};

export default HubsPage;
