import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { HubDashboard } from "@/features/hub/components/hub-dashboard";
import { getHubByIdQueryOptions } from "@/features/hub/lib/hub-query-options";
import { getPaginatedSessionsByHubIdQueryOptions } from "@/features/hub/lib/hub-sessions-query-options";
import { quickNotesByHubIdQueryOptions } from "@/features/quick-notes/lib/quick-notes-query-options";

const HubPage = async (props: PageProps<"/portal/hubs/[hubId]">) => {
  const queryClient = getQueryClient();
  const { hubId } = await props.params;

  const hubIdNumber = Number(hubId);

  if (Number.isNaN(hubIdNumber)) {
    redirect("/portal/hubs");
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
