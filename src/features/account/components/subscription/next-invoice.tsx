import { HugeiconsIcon } from "@hugeicons/react";
import { InvoiceIcon } from "@hugeicons-pro/core-stroke-rounded";
import { format } from "date-fns";

import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

import type { Invoice, Subscription } from "@/data-access/payment/formatters";
import { BillingPortalButton } from "./billing-portal-button";

type UpcomingProps = {
  upcomingInvoice: Invoice | null;
  subscription: Subscription | null;
};
export const UpcomingInvoice = ({
  upcomingInvoice,
  subscription,
}: UpcomingProps) => {
  if (!upcomingInvoice) {
    return (
      <Card className={cn("relative justify-between")}>
        <Card.Header title="Upcoming invoice" />
        <Card.Content className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 rounded-full bg-muted">
                <HugeiconsIcon
                  icon={InvoiceIcon}
                  size={24}
                  className="text-muted-fg"
                />
              </div>
              <div className="text-center space-y-1">
                <p className="text-base font-medium">No upcoming payments</p>
                <p className="text-sm text-muted-fg">
                  Your subscription will expire on{" "}
                  {subscription?.currentPeriodEnd
                    ? format(subscription.currentPeriodEnd, "MMMM d, yyyy")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </Card.Content>
        <Card.Footer>
          <BillingPortalButton
            type="RESUBSCRIBE"
            buttonProps={{
              intent: "primary",
              className: "w-full",
            }}
          />
        </Card.Footer>
      </Card>
    );
  }

  const { currency, amountDue, periodEnd } = upcomingInvoice;

  return (
    <Card>
      <Card.Header title="Upcoming invoice" />
      <Card.Content className="space-y-6">
        <p className="text-xl font-medium tabular-nums h-9 flex items-center">
          {currency}
          {amountDue?.toFixed(2)}
        </p>
        <div className="grid grid-cols-[auto_1fr] gap-4">
          <span>Payment date:</span>
          <span className="text-muted-fg font-medium">
            {periodEnd ? format(periodEnd, "MMMM d, yyyy") : "N/A"}
          </span>
          <span>Invoice details:</span>
          <span className="text-muted-fg font-medium">
            {upcomingInvoice.description || "N/A"}
          </span>
        </div>
      </Card.Content>
    </Card>
  );
};
