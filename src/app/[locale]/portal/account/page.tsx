import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { Account } from "@/features/account/components/account";
import { userSubscriptionQueryOptions } from "@/features/account/hooks/user-subscription-query-options";

export default async function AccountPage(
  props: PageProps<"/[locale]/portal/account">,
) {
  const queryClient = getQueryClient();
  const { searchParams } = props;
  const { t } = (await searchParams) ?? {};
  const isSubscriptionTab = t === "subscription";

  if (isSubscriptionTab) {
    void queryClient.prefetchQuery(userSubscriptionQueryOptions);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Account />
    </HydrationBoundary>
  );
}
