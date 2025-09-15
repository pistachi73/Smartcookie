import { queryOptions } from "@tanstack/react-query";

import { getSubscription } from "@/data-access/payment/queries";

export const userSubscriptionQueryOptions = queryOptions({
  queryKey: ["user-subscription"],
  queryFn: getSubscription,
});
