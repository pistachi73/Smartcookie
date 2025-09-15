import { format } from "date-fns";

import { Badge } from "@/shared/components/ui/badge";
import { Card, CardDescription } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";

import type {
  Price,
  StripeProduct,
  Subscription,
} from "@/data-access/payment/formatters";
import { PlanCheck } from "@/features/pricing/components/pricing-plan-cards/pricing-plan-card";
import {
  useBasicPricingPlanFeatures,
  usePremiumPricingPlanFeatures,
} from "@/features/pricing/hooks/use-pricing-plan-features";
import { BillingPortalButton } from "../billing-portal-button";

export const BasicSubscriptionCard = ({
  subscription,
  product,
  price,
  hasUpcomingInvoice,
}: {
  subscription: Subscription;
  product: StripeProduct;
  price?: Price;
  hasUpcomingInvoice: boolean;
}) => {
  const basicFeatures = useBasicPricingPlanFeatures();
  const premiumFeatures = usePremiumPricingPlanFeatures();

  const pricePerInterval = price?.unitAmount
    ? price.unitAmount / (price.interval?.toLowerCase() === "yearly" ? 12 : 1)
    : 0;

  return (
    <Card
      className={cn(
        "@container",
        "[--card-spacing:--spacing(8)]",
        "shadow-md relative overflow-hidden",
      )}
    >
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary w-full h-1" />
      <Card.Header className="gap-6 flex flex-col">
        <div className="space-y-8 shrink-0 w-full">
          <div className="space-y-2">
            <Card.Title className="flex flex-row gap-3 sm:text-2xl items-center font-bold">
              {product?.name}{" "}
              <span className="text-muted-fg font-medium">
                {price?.interval}
              </span>
              <Badge intent="primary" className="py-0.5 text-xs">
                Current Plan
              </Badge>
            </Card.Title>
            <CardDescription className="text-muted-fg text-base">
              Joined on{" "}
              {subscription?.created
                ? format(subscription.created, "MMM d, yyyy")
                : "N/A"}
            </CardDescription>
          </div>

          <div className="flex flex-col @2xl:flex-row items-start @2xl:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-4 relative">
              <p className="flex items-center gap-3">
                <span className="text-5xl font-bold tracking-tighter tabular-nums">
                  {pricePerInterval} €
                </span>
                <span className="font-semibold text-sm text-muted-fg lowercase">
                  / month
                </span>
              </p>
            </div>
            <div className="flex flex-row gap-2">
              {hasUpcomingInvoice && (
                <BillingPortalButton
                  type="CANCEL_SUBSCRIPTION"
                  buttonProps={{ className: "shrink-0", intent: "outline" }}
                />
              )}
              <BillingPortalButton
                type="MANAGE_PLAN"
                buttonProps={{ className: "shrink-0", intent: "primary" }}
              />
            </div>
          </div>
        </div>
        <div className="space-y-4 w-ful">
          <p className="text-base font-medium">With the basic plan, you get:</p>
          <ul className="grid grid-cols-1 @3xl:grid-cols-2 gap-x-20 gap-y-3 ">
            {basicFeatures.map((item) => (
              <PlanCheck key={item.id} label={item.label} />
            ))}
          </ul>
        </div>
      </Card.Header>
      <Card.Content className="space-y-8">
        <Separator />
        <div className="space-y-4">
          <div className="space-y-2 flex flex-row items-center justify-between">
            <Heading level={3} className="sm:text-xl font-semibold">
              Upgrade to premium plan
            </Heading>
            <BillingPortalButton
              type="UPGRADE_TO_PREMIUM"
              buttonProps={{ className: "shrink-0", intent: "primary" }}
            />
          </div>

          <div className="space-y-4">
            <p className="text-base font-medium">
              Everything from the basic plan, plus:
            </p>
            <ul className="grid grid-cols-1 @3xl:grid-cols-2 gap-3 w-full">
              {premiumFeatures.map((item) => (
                <PlanCheck key={item.id} label={item.label} />
              ))}
            </ul>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
