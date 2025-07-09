import { isDataAccessError } from "@/data-access/errors";
import { getSubscription } from "@/data-access/payment/queries";
import { memberChecks } from "@/features/landing/components/pricing/constants";
import { PlanCheck } from "@/features/landing/components/pricing/pricing-plan-card";
import { ExplorePremiumModal } from "@/shared/components/explore-premium-modal";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { QueryError } from "@/shared/components/ui/query-error";
import { Diamond02Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { InvoiceList } from "./invoice-list";
import { UpcomingInvoice } from "./next-invoice";
import { PaymentDetails } from "./payment-details";
import { ProSubscriptionCard } from "./pro-subscription-card";
import { SubscriptionLoading } from "./subscription-loading";

export const Subscription = () => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["subscription"],
    queryFn: getSubscription,
  });

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

  return (
    <div className="@container space-y-6">
      {subscription ? (
        <>
          {product && price && (
            <ProSubscriptionCard
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
        <div className="space-y-6">
          <Card className="shadow-md relative overflow-hidden">
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary w-full h-1" />
            <Card.Header>
              <Card.Title className="flex flex-row gap-2 text-xl items-center">
                Free plan
              </Card.Title>
              <Card.Description>
                Upgrade to Pro plan to enjoy all the benefits
              </Card.Description>
            </Card.Header>
            <Card.Content className="space-y-6">
              <ExplorePremiumModal>
                <Button size="large" className="w-full">
                  Upgrade to Pro plan
                  <HugeiconsIcon
                    icon={Diamond02Icon}
                    size={16}
                    data-slot="icon"
                  />
                </Button>
              </ExplorePremiumModal>
              <div className="space-y-4">
                <p className="text-lg font-semibold">With Pro plan you get:</p>
                <div className="flex flex-col gap-3">
                  {memberChecks.map(({ key, label, icon }) => (
                    <PlanCheck key={key} label={label} icon={icon} />
                  ))}
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
    </div>
  );
};
