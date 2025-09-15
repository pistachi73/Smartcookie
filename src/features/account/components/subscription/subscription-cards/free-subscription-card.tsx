import { HugeiconsIcon } from "@hugeicons/react";
import { TickIcon } from "@hugeicons-pro/core-stroke-rounded";
import { useState } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";

import {
  type PaymentFrequency,
  PlanFrequencySwitch,
} from "@/features/pricing/components/frequency-switch";
import { BasicPricingPlanCard } from "@/features/pricing/components/pricing-plan-cards/basic-pricing-plan-card";
import { PremiumPricingPlanCard } from "@/features/pricing/components/pricing-plan-cards/premium-pricing-plan-card";
import { useFreePricingPlanFeatures } from "@/features/pricing/hooks/use-pricing-plan-features";

export const FreeSubscriptionCard = () => {
  const [paymentFrequency, setPaymentFrequency] =
    useState<PaymentFrequency>("A");

  const freeFeatureItems = useFreePricingPlanFeatures();
  return (
    <Card
      className={cn(
        "@container",
        "[--card-spacing:--spacing(8)]",
        "shadow-md relative overflow-hidden",
      )}
    >
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary w-full h-1" />
      <Card.Header className="gap-6 flex flex-col @2xl:flex-row @2xl:gap-12">
        <div className="space-y-6 shrink-0">
          <Card.Title className="flex flex-row gap-3 sm:text-2xl items-center font-bold">
            Free plan
            <Badge intent="secondary" className="py-0.5 text-xs">
              Current Plan
            </Badge>
          </Card.Title>

          <div className="flex items-center gap-4 relative">
            <p className="flex items-center gap-3">
              <span className="text-5xl font-bold tracking-tighter tabular-nums">
                0 €
              </span>
              <span className="font-semibold text-sm text-muted-fg">
                / month
              </span>
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-base font-medium">With the free plan, you can:</p>
          <ul className="grid grid-cols-1 @3xl:grid-cols-2 gap-3">
            {freeFeatureItems.map((item) => (
              <div key={item.id} className="flex flex-row items-center gap-2">
                <HugeiconsIcon
                  icon={TickIcon}
                  size={20}
                  strokeWidth={2.5}
                  className="text-success shrink-0"
                />
                <p className="text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </ul>
        </div>
      </Card.Header>
      <Card.Content className="space-y-6">
        <Separator />
        <div className="space-y-2">
          <Heading level={3} className="sm:text-xl font-semibold">
            Upgrade plan
          </Heading>
          <p className="text-base text-muted-fg">
            Our plans are designed to grow with you.
          </p>
        </div>

        <section className="space-y-4 flex flex-col gap-4 items-center justify-center">
          <PlanFrequencySwitch
            paymentFrequency={paymentFrequency}
            setPaymentFrequency={setPaymentFrequency}
          />
          <div className="flex flex-col @3xl:flex-row gap-4">
            <BasicPricingPlanCard
              paymentFrequency={paymentFrequency}
              className="border-solid"
            />
            <PremiumPricingPlanCard
              paymentFrequency={paymentFrequency}
              className="border-solid [-card-spacing:--spacing(4)]"
            />
          </div>
        </section>
      </Card.Content>
    </Card>
  );
};
