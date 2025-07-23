import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { format } from "date-fns";

import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";

import type {
  Price,
  StripeProduct,
  Subscription,
} from "@/data-access/payment/formatters";
import { memberChecks } from "@/features/landing/components/pricing/constants";
import { BillingPortalButton } from "./billing-portal-button";

export const ProSubscriptionCard = ({
  subscription,
  product,
  price,
  hasUpcomingInvoice,
}: {
  subscription: Subscription;
  product: StripeProduct;
  price: Price;
  hasUpcomingInvoice: boolean;
}) => {
  return (
    <Card className="@container relative overflow-hidden">
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary w-full h-1" />
      <Card.Content className="space-y-4">
        <Badge intent="secondary" className="w-fit">
          Current Plan
        </Badge>
        <div className="flex flex-col @2xl:flex-row items-start @2xl:items-center justify-between gap-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Heading level={3} className="text-xl sm:text-xl font-semibold">
                {product?.name}{" "}
                <span className="text-muted-fg">{price?.interval}</span>
              </Heading>
              <p className="  text-muted-fg text-base">
                Joined on{" "}
                {subscription?.created
                  ? format(subscription.created, "MMM d, yyyy")
                  : "N/A"}
              </p>
            </div>
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
      </Card.Content>
      <Card.Footer>
        <div className="space-y-4">
          <Heading level={4} className="text-muted-fg">
            Current plan benefits
          </Heading>
          <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
            {memberChecks.map(({ key, label }) => (
              <div key={key} className="flex flex-row items-center gap-2">
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={20} />
                <p className="text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};
