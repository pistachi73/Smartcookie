import { QuickNotes } from "@/components/portal/quick-notes";
import { quickNotesHubsQueryOptions } from "@/components/portal/quick-notes/utils";
import { QuickNotesStoreProvider } from "@/providers/quick-notes-store-provider";
import { getQueryClient } from "@/utils/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

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
        <QuickNotes />
      </QuickNotesStoreProvider>
    </HydrationBoundary>
  );
}
