import { HubList } from "@/features/hub/components/hub-list";
import { SkeletonHubList } from "@/features/hub/components/skeleton-hub-list";
import { getHubsQueryOptions } from "@/features/hub/hooks/use-hubs";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { getQueryClient } from "@/shared/lib/get-query-client";
import { FolderLibraryIcon } from "@hugeicons-pro/core-solid-rounded";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";

const HubsPage = async () => {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(getHubsQueryOptions);

  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Hubs", href: "/portal/hubs", icon: FolderLibraryIcon },
        ]}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SkeletonHubList />}>
          <HubList />
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default HubsPage;
