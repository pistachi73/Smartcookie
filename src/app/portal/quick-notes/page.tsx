import { NoteIcon } from "@hugeicons-pro/core-solid-rounded";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

import { QuickNotes } from "@/features/quick-notes/components/quick-notes";
import { quickNotesHubsQueryOptions } from "@/features/quick-notes/lib/quick-notes-query-options";
import { QuickNotesStoreProvider } from "@/features/quick-notes/store/quick-notes-store-provider";

export const metadata = {
  title: "Quick Notes | Private Tutoring Manager",
  description: "Manage your quick notes for courses and general information",
};

export default async function QuickNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ hubId: string | undefined }>;
}) {
  const queryClient = new QueryClient();
  const params = await searchParams;
  const hubId = params?.hubId !== undefined ? Number(params?.hubId) : undefined;

  await queryClient.prefetchQuery({
    ...quickNotesHubsQueryOptions,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          {
            label: "Quick Notes",
            href: "/portal/quick-notes",
            icon: NoteIcon,
          },
        ]}
      />
      <QuickNotesStoreProvider
        initialVisibleHubs={hubId !== undefined ? [hubId] : undefined}
      >
        <HydrationBoundary state={dehydrate(queryClient)}>
          <QuickNotes />
        </HydrationBoundary>
      </QuickNotesStoreProvider>
    </>
  );
}
