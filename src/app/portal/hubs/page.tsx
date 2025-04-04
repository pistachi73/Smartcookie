import { HubList } from "@/features/hub/components/hub-list";
import { getHubsQueryOptions } from "@/features/hub/hooks/use-hubs";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { getQueryClient } from "@/shared/lib/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const HubsPage = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(getHubsQueryOptions);

  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Hubs", href: "/portal/hubs" },
        ]}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HubList />
      </HydrationBoundary>
    </>
  );
};

export default HubsPage;
