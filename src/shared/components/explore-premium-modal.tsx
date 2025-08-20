import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { isDataAccessError } from "@/data-access/errors";
import { createCheckoutSession } from "@/data-access/payment/mutations";
import { createCheckoutSessionSchema } from "@/data-access/payment/schemas";
import {
  type PaymentFrequency,
  PlanFrequencySwitch,
} from "@/features/landing/components/pricing/frequency-switch";
import {
  FreePlanCard,
  PremiumPlanCard,
} from "@/features/landing/components/pricing/pricing-plan-card";
import { useCurrentUser } from "../hooks/use-current-user";
import { useProtectedMutation } from "../hooks/use-protected-mutation";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { ProgressCircle } from "./ui/progress-circle";

export const ExplorePremiumModal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [paymentFrequency, setPaymentFrequency] =
    useState<PaymentFrequency>("M");
  const [isOpen, setIsOpen] = useState(false);
  const user = useCurrentUser();

  const { mutate: createCheckoutSessionMutation, isPending } =
    useProtectedMutation({
      schema: createCheckoutSessionSchema,
      mutationFn: createCheckoutSession,
      onSuccess: (result) => {
        if (isDataAccessError(result)) {
          if (result.type === "USER_ALREADY_HAS_SUBSCRIPTION") {
            setIsOpen(false);
            router.push("/portal/account?t=subscription");
            return;
          }

          toast.error("Failed to create checkout session");
          return;
        }

        if (!result.checkoutSession.url) {
          toast.error("Something went wrong");
          return;
        }

        router.push(result.checkoutSession.url);
      },
    });

  if (!user) return null;
  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      {children}
      <Modal.Content isDismissable={true} size="4xl">
        <Modal.Header className="space-y-1">
          <Modal.Title className="sm:text-2xl text-pretty font-bold">
            Upgrade to SmartCookie Pro and experience our premium business
            solution
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex flex-col gap-4 items-center pb-4 md:pb-0">
          <PlanFrequencySwitch
            paymentFrequency={paymentFrequency}
            setPaymentFrequency={setPaymentFrequency}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl">
            <FreePlanCard
              showButton={false}
              showDescription={false}
              isCurrentPlan={true}
              className="row-start-2 md:row-start-1 "
            />
            <PremiumPlanCard
              showButton={false}
              showDescription={false}
              paymentFrequency={paymentFrequency}
              className="row-start-1 md:row-start-1 h-full"
            />
          </div>
        </Modal.Body>

        <Modal.Footer className="flex gap-4 sm:flex-col-reverse flex-col-reverse md:  md:flex-row justify-between items-center border-t md:border-none">
          <div className="text-muted-fg max-w-md text-xs text-center md:text-left space-y-0.5">
            <span>
              By upgrading my account, I agree to SmartCookie Pro's Terms of
              Service.
            </span>
            <span className="font-semibold block">
              You can switch at any time.
            </span>
          </div>

          <Button
            intent="primary"
            className="w-full md:w-fit md:justify-between px-6 group bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
            onPress={() =>
              createCheckoutSessionMutation({
                paymentFrequency,
              })
            }
            isPending={isPending}
          >
            Upgrade to SmartCookie Pro
            {isPending ? (
              <ProgressCircle
                isIndeterminate
                className="size-4"
                aria-label="Creating checkout session"
              />
            ) : (
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                data-slot="icon"
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
