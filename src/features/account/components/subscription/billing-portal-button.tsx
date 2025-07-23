"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CreditCardIcon,
  Layers01Icon,
  RefreshIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button, type ButtonProps } from "@/shared/components/ui/button";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { createBillingPortalSession } from "@/data-access/payment/mutations";

type BillingPortalButtonProps = {
  type: "PAYMENT" | "MANAGE_PLAN" | "CANCEL_SUBSCRIPTION" | "RESUBSCRIBE";
  buttonProps?: ButtonProps;
};

const billingPortalButtonMapping: Record<
  BillingPortalButtonProps["type"],
  {
    label: string;
    Icon?: typeof Layers01Icon;
  }
> = {
  PAYMENT: {
    label: "Manage payment method",
    Icon: CreditCardIcon,
  },
  MANAGE_PLAN: {
    label: "Manage plan",
    Icon: Layers01Icon,
  },
  CANCEL_SUBSCRIPTION: {
    label: "Cancel plan",
  },
  RESUBSCRIBE: {
    label: "Resubscribe",
    Icon: RefreshIcon,
  },
};

export const BillingPortalButton = ({
  type,
  buttonProps,
}: BillingPortalButtonProps) => {
  const router = useRouter();

  const { mutate: createBillingPortalSessionMutation, isPending } =
    useProtectedMutation({
      schema: z.void(),
      mutationFn: () => createBillingPortalSession(),
      onSuccess: (result) => {
        if (isDataAccessError(result)) {
          toast.error("Something went wrong");
          return;
        }
        router.push(result.billingPortalSessionUrl);
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });

  const Icon = billingPortalButtonMapping[type].Icon ?? null;
  const label = billingPortalButtonMapping[type].label;

  return (
    <Button
      intent="plain"
      onPress={() => createBillingPortalSessionMutation()}
      isPending={isPending}
      {...buttonProps}
    >
      {isPending ? (
        <ProgressCircle
          isIndeterminate
          className="size-4"
          aria-label="Creating billing portal session"
        />
      ) : (
        Icon && (
          <HugeiconsIcon
            icon={Icon}
            className="text-primary"
            data-slot="icon"
            size={20}
          />
        )
      )}
      {label}
    </Button>
  );
};
