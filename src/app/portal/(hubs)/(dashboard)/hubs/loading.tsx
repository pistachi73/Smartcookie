import { FolderLibraryIcon } from "@hugeicons-pro/core-solid-rounded";

import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

import { SkeletonHubList } from "@/features/hub/components/skeleton-hub-list";

const LoadingHubsPage = () => {
  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Hubs", href: "/portal/hubs", icon: FolderLibraryIcon },
        ]}
      />
      <SkeletonHubList />
    </>
  );
};

export default LoadingHubsPage;
