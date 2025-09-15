"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/ui/button";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { cn } from "@/shared/lib/utils";

import { env } from "@/env";
import { useCreateCheckoutSession } from "../../hooks/use-create-checkout-session";
import { usePremiumPricingPlanFeatures } from "../../hooks/use-pricing-plan-features";
import type { PaymentFrequency } from "../frequency-switch";
import { PricingPlanCard } from "./pricing-plan-card";

export const PremiumPricingPlanCard = ({
  paymentFrequency,
  highlight,
  className,
  buttonDisabled = false,
}: {
  paymentFrequency: PaymentFrequency;
  highlight?: boolean;
  className?: string;
  buttonDisabled?: boolean;
}) => {
  const premiumFeatureItems = usePremiumPricingPlanFeatures();
  const t = useTranslations("Landing.Pricing");
  const { mutate: createCheckoutSession, isPending } =
    useCreateCheckoutSession();
  return (
    <PricingPlanCard
      title={t("Premium.title")}
      monthlyPrice="20 €"
      annualPrice="16 €"
      description={t("Premium.description")}
      featuresHeading={t("Premium.featuresHeading")}
      features={premiumFeatureItems}
      paymentFrequency={paymentFrequency}
      className={cn(
        "w-full px-0 border-none bg-transparent shadow-none",
        className,
      )}
      highlight={highlight}
      actionButton={
        <Button
          intent={highlight ? "primary" : "secondary"}
          className="w-full justify-between px-6 h-13 group"
          size="lg"
          onPress={() => {
            if (buttonDisabled) return;
            const priceId =
              paymentFrequency === "M"
                ? env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID
                : env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID;

            createCheckoutSession({
              priceId,
            });
          }}
        >
          {t("Premium.actionButtonLabel")}
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
