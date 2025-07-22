"use client";

import { Tag01Icon } from "@hugeicons-pro/core-solid-rounded";
import { useState } from "react";

import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";

import { LandingSectionHeader } from "../landing-section-header";
import { type PaymentFrequency, PlanFrequencySwitch } from "./frequency-switch";
import { FreePlanCard, PremiumPlanCard } from "./pricing-plan-card";

export const Plans = () => {
  const [paymentFrequency, setPaymentFrequency] =
    useState<PaymentFrequency>("M");

  return (
    <MaxWidthWrapper
      id="pricing"
      className="items-center h-full flex justify-center flex-col space-y-10"
    >
      <LandingSectionHeader
        title="Pricing plans to grow with you"
        description="Begin with a free plan and scale up as your needs evolve. Each plan provides powerful features to help you teach smarter."
        badge="Pricing"
        icon={Tag01Icon}
      />

      <PlanFrequencySwitch
        paymentFrequency={paymentFrequency}
        setPaymentFrequency={setPaymentFrequency}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Free Plan */}
        <FreePlanCard />

        {/* Professional Plan - Enhanced */}
        <PremiumPlanCard paymentFrequency={paymentFrequency} />
      </div>
    </MaxWidthWrapper>
  );
};
