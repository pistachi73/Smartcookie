import { useSuspenseQuery } from "@tanstack/react-query";

import { QueryError } from "@/shared/components/ui/query-error";

import { isDataAccessError } from "@/data-access/errors";
import { env } from "@/env";
import { userSubscriptionQueryOptions } from "../../hooks/user-subscription-query-options";
import { InvoiceList } from "./invoice-list";
import { UpcomingInvoice } from "./next-invoice";
import { PaymentDetails } from "./payment-details";
import { BasicSubscriptionCard } from "./subscription-cards/basic-subscription-card";
import { FreeSubscriptionCard } from "./subscription-cards/free-subscription-card";
import { PremiumSubscriptionCard } from "./subscription-cards/premium-subscription-card";
import { SubscriptionLoading } from "./subscription-loading";

export const Subscription = () => {
  const { data, isLoading, error, refetch, isRefetching } = useSuspenseQuery(
    userSubscriptionQueryOptions,
  );

  if (isLoading) {
    return <SubscriptionLoading />;
  }

  if (error || isDataAccessError(data)) {
    return (
      <QueryError
        title="Failed to load subscription"
        message="We couldn't load your subscription details. Please try again."
        onRetry={refetch}
        isRetrying={isRefetching}
      />
    );
  }

  const {
    subscription,
    paymentMethod,
    product,
    price,
    invoices,
    upcomingInvoice,
  } = data ?? {};

  const isBasicProduct =
    product?.id === env.NEXT_PUBLIC_STRIPE_BASIC_PRODUCT_ID;
  const isPremiumProduct =
    product?.id === env.NEXT_PUBLIC_STRIPE_PREMIUM_PRODUCT_ID;

  return (
    <div className="@container space-y-6">
      {subscription ? (
        <>
          {isBasicProduct && (
            <BasicSubscriptionCard
              subscription={subscription}
              product={product}
              price={price}
              hasUpcomingInvoice={!!upcomingInvoice}
            />
          )}
          {isPremiumProduct && (
            <PremiumSubscriptionCard
              subscription={subscription}
              product={product}
              price={price}
              hasUpcomingInvoice={!!upcomingInvoice}
            />
          )}

          <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-6">
            <PaymentDetails paymentMethod={paymentMethod ?? null} />
            <UpcomingInvoice
              upcomingInvoice={upcomingInvoice ?? null}
              subscription={subscription}
            />
          </div>

          <InvoiceList invoices={invoices ?? []} />
        </>
      ) : (
        <FreeSubscriptionCard />
      )}
    </div>
  );
};
