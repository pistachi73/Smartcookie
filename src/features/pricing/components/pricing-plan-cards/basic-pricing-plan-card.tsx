"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/ui/button";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { cn } from "@/shared/lib/utils";

import { env } from "@/env";
import { useCreateCheckoutSession } from "../../hooks/use-create-checkout-session";
import { useBasicPricingPlanFeatures } from "../../hooks/use-pricing-plan-features";
import type { PaymentFrequency } from "../frequency-switch";
import { PricingPlanCard } from "./pricing-plan-card";

export const BasicPricingPlanCard = ({
  paymentFrequency,
  className,
}: {
  paymentFrequency: PaymentFrequency;
  className?: string;
}) => {
  const basicFeatureItems = useBasicPricingPlanFeatures();
  const t = useTranslations("Landing.Pricing");
  const { mutate: createCheckoutSession, isPending } =
    useCreateCheckoutSession();

  return (
    <PricingPlanCard
      title="Professional"
      monthlyPrice="10 €"
      annualPrice="8 €"
      featuresHeading={t("Basic.featuresHeading")}
      description={t("Basic.description")}
      features={basicFeatureItems}
      paymentFrequency={paymentFrequency}
      className={cn(
        "w-full px-0 border-none bg-transparent shadow-none",
        className,
      )}
      highlight={true}
      actionButton={
        <Button
          intent="primary"
          className="w-full justify-between px-6 h-13 group bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
          onPress={() => {
            const priceId =
              paymentFrequency === "M"
                ? env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID
                : env.NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID;

            createCheckoutSession({
              priceId,
            });
          }}
          isPending={isPending}
        >
          {t("Basic.actionButtonLabel")}
          {isPending ? (
            <ProgressCircle
              isIndeterminate
              className="size-4"
              aria-label="Creating checkout session"
            />
          ) : (
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              className="shrink-0 group-hover:translate-x-1 transition-transform"
              data-slot="icon"
            />
          )}
        </Button>
      }
    />
  );
};
