import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { FolderLibraryIcon } from "@hugeicons-pro/core-solid-rounded";

export default function HubLoading() {
  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Hubs", href: "/portal/hubs", icon: FolderLibraryIcon },
          "skeleton",
        ]}
      />
      <div className="bg-bg p-5">Loading...</div>
    </>
  );
}
