import type Stripe from "stripe";

const currencySymbols: Record<Partial<Stripe.Price["currency"]>, string> = {
  eur: "€",
  usd: "$",
};

export const formatSubscription = (subscription?: Stripe.Subscription) => {
  if (!subscription) return null;

  // Get current_period_end from the first subscription item
  const firstItem = subscription.items?.data?.[0];
  const currentPeriodEnd = firstItem?.current_period_end;

  return {
    id: subscription.id,
    status: subscription.status,
    created: new Date(subscription.created * 1000),
    currentPeriodEnd: currentPeriodEnd
      ? new Date(currentPeriodEnd * 1000)
      : null,
  };
};

export const formatPaymentMethod = (paymentMethod?: Stripe.PaymentMethod) => {
  if (!paymentMethod) return null;
  return {
    id: paymentMethod.id,
    type: paymentMethod.type,
    card: {
      last4: paymentMethod?.card?.last4,
      brand: paymentMethod?.card?.brand,
      expMonth: paymentMethod?.card?.exp_month,
      expYear: paymentMethod?.card?.exp_year,
      funding: paymentMethod?.card?.funding,
      country: paymentMethod?.card?.country,
    },
    billingDetails: {
      name: paymentMethod?.billing_details?.name,
      email: paymentMethod?.billing_details?.email,
      address: paymentMethod?.billing_details?.address,
    },
  };
};

export const formatProduct = (product?: Stripe.Product) => {
  if (!product) return null;
  return {
    id: product.id,
    name: product.name,

    images: product.images[0],
  };
};

const formatInterval = (interval?: Stripe.Price.Recurring["interval"]) => {
  if (!interval) return null;

  switch (interval) {
    case "month":
      return "Monthly";
    case "year":
      return "Yearly";
    default:
      return interval;
  }
};

export const formatPrice = (price?: Stripe.Price) => {
  if (!price) return null;
  return {
    id: price.id,
    priceId: price.id,
    interval: formatInterval(price.recurring?.interval),
    currency: currencySymbols[price.currency],
    price:
      price.unit_amount && price.recurring?.interval
        ? `${price.unit_amount / 100}${currencySymbols[price.currency]}/${
            price.recurring?.interval
          }`
        : undefined,
    unitAmount: (price.unit_amount ?? 0) / 100,
    recurring: {
      interval: price.recurring?.interval,
      trial_period_days: price.recurring?.trial_period_days,
    },
  };
};

export const formatInvoice = (invoice?: Stripe.Invoice) => {
  if (!invoice) return null;

  return {
    id: invoice.id,
    number: invoice.number,
    status: invoice.status,
    description: invoice.lines.data[0]?.description,
    amountDue: (invoice.amount_due ?? 0) / 100,
    amountPaid: (invoice.amount_paid ?? 0) / 100,
    total: (invoice.total ?? 0) / 100,
    currency: currencySymbols[invoice.currency] || invoice.currency,
    created: new Date(invoice.created * 1000),
    dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
    invoicePdf: invoice.invoice_pdf,
    hostedInvoiceUrl: invoice.hosted_invoice_url,
    periodStart: invoice.period_start
      ? new Date(invoice.period_start * 1000)
      : null,
    periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : null,
    paid: invoice.status === "paid",
    attemptCount: invoice.attempt_count,
  };
};

export type Subscription = ReturnType<typeof formatSubscription>;
export type StripeProduct = ReturnType<typeof formatProduct>;
export type Price = ReturnType<typeof formatPrice>;
export type PaymentMethod = ReturnType<typeof formatPaymentMethod>;
export type Invoice = ReturnType<typeof formatInvoice>;
