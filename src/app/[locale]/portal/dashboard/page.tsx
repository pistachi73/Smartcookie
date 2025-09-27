import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";

import { generatePortalMetadata } from "@/shared/lib/generate-metadata";
import { getQueryClient } from "@/shared/lib/get-query-client";

import { Dashboard } from "@/features/dashboard/components";
import { getWeeklyHoursQueryOptions } from "@/features/dashboard/hooks/hook-options";
import { getNextSessionQueryOptions } from "@/features/dashboard/lib/get-next-session-query-options";

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePortalMetadata({ namespace: "Metadata.Dashboard" });
};

const DashboardPage = async () => {
  const queryClient = getQueryClient();
  const now = new Date();

  void queryClient.prefetchQuery(getNextSessionQueryOptions());
  void queryClient.prefetchQuery(getWeeklyHoursQueryOptions(now.toISOString()));

  const dehydratedState = dehydrate(queryClient);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <HydrationBoundary state={dehydratedState}>
      <Dashboard />
    </HydrationBoundary>
  );
};

export default DashboardPage;
