import { QuickNotes } from "@/components/portal/quick-notes";
import { quickNotesQueryOptions } from "@/components/portal/quick-notes/utils";
import { QuickNotesStoreProvider } from "@/providers/quick-notes-store-provider";
import { getQueryClient } from "@/utils/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export const metadata = {
  title: "Quick Notes | Private Tutoring Manager",
  description: "Manage your quick notes for courses and general information",
};

export default async function QuickNotesPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(quickNotesQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuickNotesStoreProvider>
        <QuickNotes />
      </QuickNotesStoreProvider>
    </HydrationBoundary>
  );
}
