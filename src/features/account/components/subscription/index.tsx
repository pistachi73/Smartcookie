"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { Heading } from "@/shared/components/ui/heading";
import { QueryError } from "@/shared/components/ui/query-error";
import { Tabs } from "@/shared/components/ui/tabs";

import { isDataAccessError } from "@/data-access/errors";
import { env } from "@/env";
import { userSubscriptionQueryOptions } from "../../hooks/user-subscription-query-options";
import { AccountTabs } from "../account-tabs";
import { InvoiceList } from "./invoice-list";
import { UpcomingInvoice } from "./next-invoice";
import { PaymentDetails } from "./payment-details";
import { BasicSubscriptionCard } from "./subscription-cards/basic-subscription-card";
import { FreeSubscriptionCard } from "./subscription-cards/free-subscription-card";
import { PremiumSubscriptionCard } from "./subscription-cards/premium-subscription-card";
import { SubscriptionLayout } from "./subscription-layout";

export const Subscription = () => {
  const { data, error, refetch, isRefetching } = useSuspenseQuery(
    userSubscriptionQueryOptions,
  );

  if (error || isDataAccessError(data)) {
    return (
      <SubscriptionLayout>
        <AccountTabs selectedTab="subscription">
          <Tabs.Panel
            id="subscription"
            className="max-w-[840px] mx-auto w-full p-4 sm:p-5 space-y-4"
          >
            <QueryError
              title="Failed to load subscription"
              message="We couldn't load your subscription details. Please try again."
              onRetry={refetch}
              isRetrying={isRefetching}
            />
          </Tabs.Panel>
        </AccountTabs>
      </SubscriptionLayout>
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
    <SubscriptionLayout>
      <AccountTabs selectedTab="subscription">
        <Tabs.Panel
          id="subscription"
          className="max-w-[840px] mx-auto w-full p-4 sm:p-5 space-y-4"
        >
          <div className="space-y-1.5 pb-4">
            <Heading
              level={2}
              className="sm:text-2xl text-xl font-bold"
              tracking="tight"
            >
              Subscription
            </Heading>
            <p className="text-muted-fg text-base">
              Manage your billing and subscription preferences
            </p>
          </div>
          <div className="@container space-y-6">
            {subscription?.status === "active" ? (
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
        </Tabs.Panel>
      </AccountTabs>
    </SubscriptionLayout>
  );
};
