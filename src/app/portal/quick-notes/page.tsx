import { getQueryClient } from "@/shared/lib/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { QuickNotes } from "@/features/notes/components/quick-notes";
import { quickNotesHubsQueryOptions } from "@/features/notes/lib/quick-notes-query-options";
import { QuickNotesStoreProvider } from "@/features/notes/store/quick-notes-store-provider";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

export const metadata = {
  title: "Quick Notes | Private Tutoring Manager",
  description: "Manage your quick notes for courses and general information",
};

export default async function QuickNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ hubId: string | undefined }>;
}) {
  const params = await searchParams;
  const hubId = params?.hubId !== undefined ? Number(params?.hubId) : undefined;
  const queryClient = getQueryClient();
  const promises = [queryClient.prefetchQuery(quickNotesHubsQueryOptions)];

  await Promise.all(promises);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuickNotesStoreProvider
        initialVisibleHubs={hubId !== undefined ? [hubId] : undefined}
      >
        <PortalNav
          breadcrumbs={[
            { label: "Portal", href: "/portal" },
            { label: "Quick Notes", href: "/portal/quick-notes" },
          ]}
        />
        <QuickNotes />
      </QuickNotesStoreProvider>
    </HydrationBoundary>
  );
}
