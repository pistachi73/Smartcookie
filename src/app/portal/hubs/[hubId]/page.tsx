import { HubDashboard } from "@/features/hub/components/hub-dashboard";
import { getHubByIdQueryOptions } from "@/features/hub/hooks/use-hub-by-id";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { currentUser } from "@/shared/lib/auth";
import { getQueryClient } from "@/shared/lib/get-query-client";
import {
  Folder02Icon,
  FolderLibraryIcon,
} from "@hugeicons-pro/core-solid-rounded";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";

interface HubPageProps {
  params: Promise<{
    hubId: string;
  }>;
}

const HubPage = async ({ params }: HubPageProps) => {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  const { hubId } = await params;
  const hubIdNumber = Number(hubId);

  if (Number.isNaN(hubIdNumber)) {
    redirect("/portal/hubs");
  }

  const queryClient = getQueryClient();
  const hub = await queryClient.fetchQuery(getHubByIdQueryOptions(hubIdNumber));

  if (!hub) {
    redirect("/portal/hubs");
  }

  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Hubs", href: "/portal/hubs", icon: FolderLibraryIcon },
          {
            label: hub.name,
            href: `/portal/hubs/${hubId}`,
            icon: Folder02Icon,
          },
        ]}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HubDashboard hubId={hubIdNumber} />
      </HydrationBoundary>
    </>
  );
};

export default HubPage;
