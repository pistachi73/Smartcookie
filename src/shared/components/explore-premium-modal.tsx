import { useState } from "react";

import {
  type PaymentFrequency,
  PlanFrequencySwitch,
} from "@/features/pricing/components/frequency-switch";
import { BasicPricingPlanCard } from "@/features/pricing/components/pricing-plan-cards/basic-pricing-plan-card";
import { PremiumPricingPlanCard } from "@/features/pricing/components/pricing-plan-cards/premium-pricing-plan-card";
import { useRouter } from "@/i18n/navigation";
import { useCurrentUser } from "../hooks/use-current-user";
import { Modal } from "./ui/modal";
import { Separator } from "./ui/separator";

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
        <Modal.Body className="flex flex-col gap-4 items-center pb-4 md:pb-0 overflow-visible">
          <PlanFrequencySwitch
            paymentFrequency={paymentFrequency}
            setPaymentFrequency={setPaymentFrequency}
          />

          <div className="gap-5 w-full max-w-4xl border p-4 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row gap-2">
              <BasicPricingPlanCard paymentFrequency={paymentFrequency} />
              <Separator orientation="vertical" />
              <PremiumPricingPlanCard paymentFrequency={paymentFrequency} />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="mt-4 flex gap-4 sm:flex-col-reverse flex-col-reverse md:  md:flex-row justify-between items-center border-t md:border-none">
          <div className="text-muted-fg max-w-md text-xs text-center md:text-left space-y-0.5">
            <span>
              By upgrading my account, I agree to SmartCookie Pro's Terms of
              Service.
            </span>
            <span className="font-semibold block">
              You can switch at any time.
            </span>
          </div>

          {/* <Button
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
          </Button> */}
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
