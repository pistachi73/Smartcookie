import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { cookies } from "next/headers";

import { generatePortalMetadata } from "@/shared/lib/generate-metadata";
import { getQueryClient } from "@/shared/lib/get-query-client";

import { QuickNotes } from "@/features/quick-notes/components/quick-notes";
import {
  quickNotesByHubIdQueryOptions,
  quickNotesHubsQueryOptions,
} from "@/features/quick-notes/lib/quick-notes-query-options";
import { VISIBLE_HUBS_COOKIE_NAME } from "@/features/quick-notes/store/quick-notes-store";
import { QuickNotesStoreProvider } from "@/features/quick-notes/store/quick-notes-store-provider";

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePortalMetadata({ namespace: "Metadata.QuickNotes" });
};

export default async function QuickNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ hubId: string | undefined }>;
}) {
  const queryClient = getQueryClient();
  const params = await searchParams;
  const cookieStore = await cookies();
  const hubId = params?.hubId ? Number(params.hubId) : undefined;

  const cookiesVisibleHubs = cookieStore.get(VISIBLE_HUBS_COOKIE_NAME)?.value;
  const initialCookieVisibleHubs = cookiesVisibleHubs
    ?.toString()
    .split(",")
    .map(Number);

  const vHubs = new Set([
    ...(initialCookieVisibleHubs || []),
    ...(hubId !== undefined ? [hubId] : []),
  ]);

  const allVisibleHubs = Array.from(vHubs);

  void queryClient.prefetchQuery(quickNotesHubsQueryOptions);

  if (allVisibleHubs) {
    for (const visibleHubId of allVisibleHubs) {
      void queryClient.prefetchQuery(
        quickNotesByHubIdQueryOptions(visibleHubId),
      );
    }
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <QuickNotesStoreProvider initialVisibleHubs={allVisibleHubs}>
        <QuickNotes />
      </QuickNotesStoreProvider>
    </HydrationBoundary>
  );
}
