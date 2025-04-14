import { SkeletonHubList } from "@/features/hub/components/skeleton-hub-list";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { FolderLibraryIcon } from "@hugeicons-pro/core-solid-rounded";

export default function HubsLoading() {
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
}
