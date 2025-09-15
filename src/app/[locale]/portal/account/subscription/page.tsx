import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { Subscription } from "@/features/account/components/subscription";
import { userSubscriptionQueryOptions } from "@/features/account/hooks/user-subscription-query-options";

export default async function AccountSubscriptionPage() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(userSubscriptionQueryOptions);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Subscription />
    </HydrationBoundary>
  );
}
