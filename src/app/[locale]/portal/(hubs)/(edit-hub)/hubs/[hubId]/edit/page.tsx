import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { EditHub } from "@/features/hub/components/hub-form/edit-hub";
import { getHubByIdQueryOptions } from "@/features/hub/lib/hub-query-options";

export default async function HubEditPage(
  pageProps: PageProps<"/[locale]/portal/hubs/[hubId]/edit">,
) {
  const queryClient = getQueryClient();
  const { hubId } = await pageProps.params;

  void queryClient.prefetchQuery(getHubByIdQueryOptions(Number(hubId)));

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <EditHub hubId={Number(hubId)} />
    </HydrationBoundary>
  );
}
