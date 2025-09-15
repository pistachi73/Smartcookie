"use client";

import { Tag01Icon } from "@hugeicons-pro/core-solid-rounded";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";

import {
  type PaymentFrequency,
  PlanFrequencySwitch,
} from "@/features/pricing/components/frequency-switch";
import { BasicPricingPlanCard } from "@/features/pricing/components/pricing-plan-cards/basic-pricing-plan-card";
import { FreePricingPlanCard } from "@/features/pricing/components/pricing-plan-cards/free-pricing-plan-card";
import { PremiumPricingPlanCard } from "@/features/pricing/components/pricing-plan-cards/premium-pricing-plan-card";
import { LandingSectionHeader } from "./landing-section-header";

export const Plans = () => {
  const [paymentFrequency, setPaymentFrequency] =
    useState<PaymentFrequency>("A");
  const t = useTranslations("Landing.Pricing");
  return (
    <MaxWidthWrapper
      id="pricing"
      className="items-center h-full flex justify-center flex-col space-y-10 max-w-7xl"
    >
      <LandingSectionHeader
        title={t("title")}
        description={t("description")}
        badge={t("badge")}
        icon={Tag01Icon}
      />

      <PlanFrequencySwitch
        paymentFrequency={paymentFrequency}
        setPaymentFrequency={setPaymentFrequency}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 w-full bg-muted p-4 rounded-3xl shadow-md">
        <FreePricingPlanCard />
        <div className="flex flex-col lg:flex-row  gap-4 w-full grow bg-white rounded-xl shadow-sm border">
          <BasicPricingPlanCard paymentFrequency={paymentFrequency} />
          <PremiumPricingPlanCard paymentFrequency={paymentFrequency} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};
