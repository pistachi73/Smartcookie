import { HubList } from "@/features/hub/components/hub-list";
import { getHubsByUserIdQueryOptions } from "@/features/hub/lib/hub-query-options";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { FolderLibraryIcon } from "@hugeicons-pro/core-solid-rounded";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

const HubsPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    ...getHubsByUserIdQueryOptions,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Hubs", href: "/portal/hubs", icon: FolderLibraryIcon },
        ]}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HubList />
      </HydrationBoundary>
    </>
  );
};

export default HubsPage;
