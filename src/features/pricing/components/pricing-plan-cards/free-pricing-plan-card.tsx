import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/ui/button";

import { useFreePricingPlanFeatures } from "../../hooks/use-pricing-plan-features";
import { PricingPlanCard } from "./pricing-plan-card";

export const FreePricingPlanCard = () => {
  const freeFeatureItems = useFreePricingPlanFeatures();
  const t = useTranslations("Landing.Pricing");
  return (
    <PricingPlanCard
      title="Free"
      description={t("Free.description")}
      monthlyPrice="0 €"
      annualPrice="0 €"
      features={freeFeatureItems}
      featuresHeading={t("Free.featuresHeading")}
      className="w-full px-0 border-none bg-transparent shadow-none"
      actionButton={
        <Button
          intent="secondary"
          className="w-full justify-between px-6 h-13 group"
          size="lg"
        >
          {t("Free.actionButtonLabel")}
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={20}
            className="shrink-0 group-hover:translate-x-1 transition-transform"
            data-slot="icon"
          />
        </Button>
      }
    />
  );
};
