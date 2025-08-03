import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { getHubById } from "@/data-access/hubs/queries";
import { getNotesByHubId } from "@/data-access/quick-notes/queries";
import { HubDashboard } from "@/features/hub/components/hub-dashboard";
import { getHubByIdQueryOptions } from "@/features/hub/lib/hub-query-options";
import { quickNotesByHubIdQueryOptions } from "@/features/quick-notes/lib/quick-notes-query-options";

interface HubPageProps {
  params: Promise<{
    hubId: string;
  }>;
}

const HubPage = async ({ params }: HubPageProps) => {
  const queryClient = getQueryClient();
  const { hubId } = await params;

  const hubIdNumber = Number(hubId);

  if (Number.isNaN(hubIdNumber)) {
    redirect("/portal/hubs");
  }

  const [hub, notes] = await Promise.all([
    getHubById({ hubId: hubIdNumber }),
    getNotesByHubId({ hubId: hubIdNumber }),
  ]);

  if (!hub) {
    redirect("/portal/hubs");
  }

  // Set both data sets we already fetched
  queryClient.setQueryData(getHubByIdQueryOptions(hubIdNumber).queryKey, hub);
  queryClient.setQueryData(
    quickNotesByHubIdQueryOptions(hubIdNumber).queryKey,
    notes,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HubDashboard hubId={hubIdNumber} />
    </HydrationBoundary>
  );
};

export default HubPage;
