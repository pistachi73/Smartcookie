"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Diamond02Icon } from "@hugeicons-pro/core-solid-rounded";

import { Button, type ButtonProps } from "@/shared/components/ui/button";
import { ExplorePremiumModal } from "@/shared/components/explore-premium-modal";
import { useCurrentUser } from "@/shared/hooks/use-current-user";

import { BillingPortalButton } from "@/features/account/components/subscription/billing-portal-button";

export function UpgradePlanButton(buttonProps: ButtonProps) {
  const user = useCurrentUser();

  if (!user) return null;

  const subscriptionTier = user.subscriptionTier || "free";

  // For free users, show the explore premium modal
  if (subscriptionTier === "free") {
    return (
      <ExplorePremiumModal>
        <Button
          intent="primary"
          size="sm"
          className="w-full sm:w-auto"
          {...buttonProps}
        >
          Upgrade to Premium
          <HugeiconsIcon icon={Diamond02Icon} data-slot="icon" />
        </Button>
      </ExplorePremiumModal>
    );
  }

  // For basic users, show link to subscription page
  if (subscriptionTier === "basic") {
    return (
      <BillingPortalButton
        type="UPGRADE_TO_PREMIUM"
        buttonProps={buttonProps}
      />
    );
  }

  return null;
}
