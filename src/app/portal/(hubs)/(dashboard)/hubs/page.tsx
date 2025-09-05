import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { getHubsByUserId } from "@/data-access/hubs/queries";
import { HubList } from "@/features/hub/components/hub-list";
import { getHubsByUserIdQueryOptions } from "@/features/hub/lib/hub-query-options";

const HubsPage = async () => {
  const queryClient = getQueryClient();

  const hubsQueryOptionsKey = getHubsByUserIdQueryOptions(queryClient).queryKey;
  const hubs = await getHubsByUserId();

  queryClient.setQueryData(hubsQueryOptionsKey, hubs);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HubList />
    </HydrationBoundary>
  );
};

export default HubsPage;
