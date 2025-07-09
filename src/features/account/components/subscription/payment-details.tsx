import type { PaymentMethod } from "@/data-access/payment/formatters";
import { Card } from "@/shared/components/ui/card";
import {
  CreditCardIcon,
  MasterCardIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { BillingPortalButton } from "./billing-portal-button";

type PaymentDetailsProps = {
  paymentMethod: PaymentMethod | null;
};

export const PaymentDetails = ({ paymentMethod }: PaymentDetailsProps) => {
  if (!paymentMethod) {
    return (
      <Card className="justify-between">
        <Card.Header title="Payment method" />
        <Card.Content>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 rounded-full bg-muted">
                <HugeiconsIcon
                  icon={CreditCardIcon}
                  size={24}
                  className="text-muted-fg"
                />
              </div>
              <div className="text-center space-y-1">
                <p className="text-base font-medium">No payment method</p>
                <p className="text-sm text-muted-fg">
                  Add a payment method to manage your subscription
                </p>
              </div>
            </div>
          </div>
        </Card.Content>
        <Card.Footer>
          <BillingPortalButton
            type="PAYMENT"
            buttonProps={{
              intent: "primary",
              className: "w-full",
            }}
          />
        </Card.Footer>
      </Card>
    );
  }

  const { card } = paymentMethod;

  return (
    <Card>
      <Card.Header title="Payment method" />
      <Card.Content className="space-y-6">
        <div className="flex items-center gap-4">
          <HugeiconsIcon icon={MasterCardIcon} size={36} />
          <span className="text-xl font-medium tabular-nums">
            <sup>**** **** ****</sup> {card?.last4}
          </span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-4">
          <span>Name on Card:</span>
          <span className="text-muted-fg font-medium">
            {paymentMethod.billingDetails?.name || "N/A"}
          </span>
          <span>Expiration date:</span>
          <span className="text-muted-fg font-medium">
            {card?.expMonth && card?.expYear
              ? `${String(card.expMonth).padStart(2, "0")}/${String(card.expYear).slice(-2)}`
              : "N/A"}
          </span>
        </div>
      </Card.Content>
      <Card.Footer>
        <BillingPortalButton
          type="PAYMENT"
          buttonProps={{
            intent: "outline",
            className: "flex-1 w-full",
          }}
        />
      </Card.Footer>
    </Card>
  );
};
