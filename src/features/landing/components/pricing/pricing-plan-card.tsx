"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons-pro/core-solid-rounded";

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
import { cn } from "@/shared/lib/utils";

import { guestChecks, memberChecks } from "./constants";
import type { PaymentFrequency } from "./frequency-switch";

export const PremiumPlanCard = ({
  paymentFrequency,
  showButton = true,
  showDescription = true,
  className,
}: {
  paymentFrequency: PaymentFrequency;
  showButton?: boolean;
  showDescription?: boolean;
  className?: string;
}) => {
  return (
    <Card
      className={cn(
        "[--card-spacing:--spacing(8)]",
        "w-full overflow-hidden  transition-transform flex flex-col justify-between relative border-2 border-primary shadow-lg",
        className,
      )}
    >
      <CardHeader className={cn(showDescription ? "gap-4" : "gap-0")}>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <span className="tracking-tighter">Professional</span>
          <Badge intent="primary" className="px-4 py-1 text-xs font-medium">
            Most Popular
          </Badge>
        </CardTitle>
        {showDescription && (
          <CardDescription className="text-muted-fg text-base">
            Ideal for teachers who want to streamline their lesson planning and
            management.
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-8 flex-1">
        <Separator />
        <div className="flex items-center gap-4 relative">
          <p className="flex items-center gap-3">
            <span className="text-5xl font-bold tracking-tighter tabular-nums text-primary">
              {paymentFrequency === "M" ? "9.95 €" : "8.55 €"}
            </span>
            <span className="font-semibold text-sm text-muted-fg">/ month</span>
          </p>
          {paymentFrequency === "A" && (
            <Badge intent="primary" className="p-1 px-2">
              15% off
            </Badge>
          )}
        </div>

        {showButton && (
          <Button
            intent="primary"
            className="w-full justify-between px-6 h-13 group bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            Comming soon
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={20}
              className="shrink-0 group-hover:translate-x-1 transition-transform"
              data-slot="icon"
            />
          </Button>
        )}

        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-fg uppercase">
            Everything in Free, plus:
          </p>
          <div className="flex flex-col gap-3">
            {memberChecks.map(({ key, label, icon }) => (
              <PlanCheck key={key} label={label} icon={icon} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type FreePlanCardProps = {
  showButton?: boolean;
  showDescription?: boolean;
  isCurrentPlan?: boolean;
  className?: string;
};

export const FreePlanCard = ({
  showButton = true,
  showDescription = true,
  isCurrentPlan = false,
  className,
}: FreePlanCardProps) => {
  return (
    <Card
      className={cn(
        "[--card-spacing:--spacing(8)]",
        "w-full overflow-hidden transition-transform flex flex-col justify-between",
        className,
      )}
    >
      <CardHeader className={cn(showDescription ? "gap-4" : "gap-0")}>
        <CardTitle className="text-2xl font-bold flex items-center gap-x-2">
          <span className="tracking-tighter">Free</span>
          {isCurrentPlan && (
            <Badge intent="secondary" className="px-4 py-1 text-xs font-medium">
              Current Plan
            </Badge>
          )}
        </CardTitle>

        {showDescription && (
          <CardDescription className="text-muted-fg text-base">
            Perfect for getting started with basic tutoring management.
          </CardDescription>
        )}
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

        {showButton && (
          <Button
            intent="secondary"
            className="w-full justify-between px-6 h-13 group"
            size="lg"
          >
            Comming soon
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={20}
              className="shrink-0 group-hover:translate-x-1 transition-transform"
              data-slot="icon"
            />
          </Button>
        )}

        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-fg uppercase">
            What's included
          </p>
          <div className="flex flex-col gap-3">
            {guestChecks.map(({ key, label, icon }) => (
              <PlanCheck key={key} label={label} icon={icon} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const PlanCheck = ({ label, icon }: { label: string; icon?: any }) => {
  return (
    <div className="flex flex-row items-center gap-3">
      {icon && <HugeiconsIcon icon={icon} size={16} strokeWidth={1.5} />}
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};
