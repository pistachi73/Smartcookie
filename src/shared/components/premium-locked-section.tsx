"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Diamond02Icon,
  SecurityLockIcon,
} from "@hugeicons-pro/core-stroke-rounded";

import { cn } from "../lib/utils";
import { ExplorePremiumModal } from "./explore-premium-modal";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface PremiumLockedSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

export const PremiumLockedSection = ({
  title = "Premium Feature",
  description = "This feature is available with SmartCookie Premium. Upgrade to unlock advanced functionality and enhance your experience.",
  className = "",
}: PremiumLockedSectionProps) => {
  return (
    <Card
      className={cn(
        "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20  max-w-xl",
        className,
      )}
    >
      <Card.Header className="relative z-10 flex flex-col items-center text-center space-y-4 p-8">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
          <div className="relative p-4 bg-primary/10 rounded-full border border-primary/20">
            <HugeiconsIcon
              icon={SecurityLockIcon}
              size={28}
              className="text-primary"
            />
          </div>
        </div>

        {/* Section Blocked Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
          <HugeiconsIcon icon={SecurityLockIcon} size={14} />
          Section Blocked
        </div>

        <Card.Title className="text-xl font-semibold">{title}</Card.Title>

        <Card.Description className="text-base leading-relaxed max-w-md">
          {description}
        </Card.Description>
      </Card.Header>

      <Card.Footer className="relative z-10 flex justify-center p-8 pt-0">
        <ExplorePremiumModal>
          <Button intent="primary" size="lg" className="group">
            <HugeiconsIcon
              icon={Diamond02Icon}
              className="group-hover:rotate-12 transition-transform duration-200"
              data-slot="icon"
            />
            Upgrade to Premium
          </Button>
        </ExplorePremiumModal>
      </Card.Footer>
    </Card>
  );
};
