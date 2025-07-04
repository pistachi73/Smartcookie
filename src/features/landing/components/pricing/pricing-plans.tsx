"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { ArrowRight02Icon, Tag01Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { LandingSectionHeader } from "../landing-section-header";
import { guestChecks, memberChecks } from "./constants";
import { PlanFrequencySwitch } from "./frequency-switch";

export const Plans = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentFrequency, setPaymentFrequency] = useState<"M" | "A">("M");

  const sessionId = searchParams.get("session_id");

  return (
    <MaxWidthWrapper
      id="pricing"
      className="items-center h-full flex justify-center flex-col space-y-12"
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
        <Card
          className="w-full overflow-hidden transition-transform flex flex-col justify-between"
          spacing="lg"
        >
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl font-bold tracking-tighter flex items-center gap-2">
              Free
            </CardTitle>
            <CardDescription className="text-muted-fg text-base">
              Perfect for getting started with basic tutoring management.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 flex-1">
            <Separator />
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-3">
                <span className="text-5xl font-bold tracking-tighter tabular-nums">
                  0 €
                </span>
                <span className="font-semibold text-sm text-muted-fg">
                  / forever
                </span>
              </p>
            </div>

            <Button
              intent="secondary"
              className="w-full justify-between px-6 h-13 group"
              size="large"
            >
              Start Fere Trial
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={20}
                className="shrink-0 group-hover:translate-x-1 transition-transform"
                data-slot="icon"
              />
            </Button>

            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-fg uppercase">
                What's included
              </p>
              <div className="flex flex-col gap-3">
                {guestChecks.map(({ key, label, icon }) => (
                  <PlanCheck
                    key={key}
                    label={label}
                    icon={icon}
                    checked={true}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Plan - Enhanced */}
        <Card
          className="w-full overflow-hidden transition-transform flex flex-col justify-between relative border-2 border-primary shadow-lg"
          spacing="lg"
        >
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <span className="tracking-tighter">Professional</span>
              <Badge intent="primary" className="px-4 py-1 text-xs font-medium">
                Most Popular
              </Badge>
            </CardTitle>
            <CardDescription className="text-muted-fg text-base">
              Ideal for teachers who want to streamline their lesson planning
              and management.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 flex-1">
            <Separator />
            <div className="flex items-center gap-4 relative">
              <p className="flex items-center gap-3">
                <span className="text-5xl font-bold tracking-tighter tabular-nums text-primary">
                  {paymentFrequency === "M" ? "10.00 €" : "8.50 €"}
                </span>
                <span className="font-semibold text-sm text-muted-fg">
                  / month
                </span>
              </p>
              {paymentFrequency === "A" && (
                <Badge intent="primary" className="p-1 px-2" shape="square">
                  15% off
                </Badge>
              )}
            </div>

            <Button
              intent="primary"
              className="w-full justify-between px-6 h-13 group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
              size="large"
            >
              Get Started
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={20}
                className="shrink-0 group-hover:translate-x-1 transition-transform"
                data-slot="icon"
              />
            </Button>

            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-fg uppercase">
                Everything in Free, plus:
              </p>
              <div className="flex flex-col gap-3">
                {memberChecks.map(({ key, label, icon }) => (
                  <PlanCheck
                    key={key}
                    label={label}
                    icon={icon}
                    checked={true}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
};

const PlanCheck = ({
  label,
  checked,
  icon,
}: {
  label: string;
  checked: boolean;
  icon?: any;
}) => {
  return (
    <div className="flex flex-row items-center gap-3">
      {icon && <HugeiconsIcon icon={icon} size={16} strokeWidth={1.5} />}
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};
