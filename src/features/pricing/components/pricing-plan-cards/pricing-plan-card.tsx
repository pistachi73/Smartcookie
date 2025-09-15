"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { TickIcon } from "@hugeicons-pro/core-stroke-rounded";
import { useTranslations } from "next-intl";

import { Badge, type BadgeProps } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

import type { PaymentFrequency } from "../frequency-switch";

type PricingPlanCardProps = {
  title: string;
  description?: string;
  badge?: {
    label: string;
    intent: BadgeProps["intent"];
  };
  monthlyPrice?: string;
  annualPrice?: string;
  features: {
    id: string;
    label: string;
  }[];
  featuresHeading?: string;
  actionButton?: React.ReactNode;
  className?: string;
  paymentFrequency?: PaymentFrequency;
  highlight?: boolean;
};

export const PricingPlanCard = ({
  title,
  description,
  badge,
  monthlyPrice,
  annualPrice,
  features,
  featuresHeading,
  actionButton,
  className,
  paymentFrequency,
  highlight = false,
}: PricingPlanCardProps) => {
  const t = useTranslations("Landing.Pricing");
  return (
    <Card
      className={cn(
        "[--card-spacing:--spacing(8)]",
        "w-full overflow-hidden  transition-transform flex flex-col justify-between relative",
        className,
      )}
    >
      <CardHeader className={cn(description ? "gap-2" : "gap-0")}>
        <CardTitle className="sm:text-xl font-bold flex items-center gap-2">
          <span className="tracking-tighter">{title}</span>
          {badge ? (
            <Badge
              intent={badge.intent}
              className="px-4 py-1 text-xs font-medium"
            >
              {badge.label}
            </Badge>
          ) : highlight ? (
            <Badge intent="primary" className="px-4 py-1 text-xs font-medium">
              Best value
            </Badge>
          ) : null}
        </CardTitle>
        {description && (
          <CardDescription className="text-muted-fg md:min-h-[60px]">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6 flex-1">
        <section className="space-y-2">
          <div className="flex items-center gap-4 relative">
            <p className="flex items-center gap-3">
              <span
                className={cn(
                  "text-5xl font-bold tracking-tighter tabular-nums",
                  highlight && "text-primary",
                )}
              >
                {paymentFrequency === "M" ? monthlyPrice : annualPrice}
              </span>
              <span className="font-semibold text-sm text-muted-fg">
                / {t("paymentFrequencyLabel")}
              </span>
            </p>
          </div>

          <p className={cn("text-muted-fg text-sm text-balance h-3.5")}>
            {paymentFrequency === "A" ? t("annualBillingLabel") : null}
          </p>
        </section>

        {actionButton}
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-fg uppercase">
            {featuresHeading}
          </p>
          <div className="flex flex-col gap-3">
            {features.map(({ id, label }) => (
              <PlanCheck key={id} label={label} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PlanCheck = ({ label }: { label: string }) => {
  return (
    <div className="flex flex-row items-center gap-3">
      <HugeiconsIcon
        icon={TickIcon}
        size={20}
        strokeWidth={2}
        className="text-primary shrink-0"
      />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};
