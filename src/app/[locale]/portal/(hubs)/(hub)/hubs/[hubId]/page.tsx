import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { HubDashboard } from "@/features/hub/components/hub-dashboard";
import { HubNotFound } from "@/features/hub/components/hub-not-found";
import { getHubByIdQueryOptions } from "@/features/hub/lib/hub-query-options";
import { getPaginatedSessionsByHubIdQueryOptions } from "@/features/hub/lib/hub-sessions-query-options";
import { quickNotesByHubIdQueryOptions } from "@/features/quick-notes/lib/quick-notes-query-options";

const HubPage = async (props: PageProps<"/[locale]/portal/hubs/[hubId]">) => {
  const queryClient = getQueryClient();

  const [{ hubId }] = await Promise.all([props.params]);

  const hubIdNumber = Number(hubId);

  if (Number.isNaN(hubIdNumber)) {
    return <HubNotFound />;
  }

  void queryClient.prefetchQuery(getHubByIdQueryOptions(hubIdNumber));
  void queryClient.prefetchQuery(quickNotesByHubIdQueryOptions(hubIdNumber));
  void queryClient.prefetchInfiniteQuery(
    getPaginatedSessionsByHubIdQueryOptions(hubIdNumber),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HubDashboard hubId={hubIdNumber} />
    </HydrationBoundary>
  );
};

export default HubPage;
