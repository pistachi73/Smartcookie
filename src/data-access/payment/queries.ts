"use server";

import Stripe from "stripe";

import { env } from "@/env";
import { createDataAccessError } from "../errors";
import { withAuthenticationNoInput } from "../protected-data-access";
import { getUserById } from "../user/queries";
import { getUserSubscriptionByUserId } from "../user-subscription/queries";
import {
  formatInvoice,
  formatPaymentMethod,
  formatPrice,
  formatProduct,
  formatSubscription,
  type Invoice,
} from "./formatters";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

export const getSubscription = withAuthenticationNoInput({
  callback: async (user) => {
    const userSubscription = await getUserSubscriptionByUserId({
      userId: user.id,
    });

    const userRecord = await getUserById({ id: user.id });

    if (!userRecord) {
      console.log("User not found");
      return createDataAccessError("NOT_FOUND");
    }

    const customerId = userRecord.stripeCustomerId;
    const subscriptionId = userSubscription?.stripeSubscriptionId;

    if (!customerId) {
      return createDataAccessError("NOT_FOUND", "User has no customer iD");
    }

    if (!subscriptionId) {
      return null;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription) {
      return null;
    }

    const defaultPaymentMethodId = subscription.default_payment_method;
    const productId = subscription.items.data[0]?.price.product;

    const [paymentMethod, product, invoices, upcomingInvoice] =
      await Promise.all([
        typeof defaultPaymentMethodId === "string"
          ? stripe.paymentMethods.retrieve(defaultPaymentMethodId)
          : Promise.resolve(null),
        typeof productId === "string"
          ? stripe.products.retrieve(productId)
          : Promise.resolve(null),
        stripe.invoices.list({
          customer: customerId,
          limit: 4,
        }),
        stripe.invoices
          .createPreview({
            customer: customerId,
            subscription: subscriptionId,
          })
          .catch(() => null),
      ]);

    return {
      subscription: formatSubscription(subscription),
      paymentMethod: paymentMethod ? formatPaymentMethod(paymentMethod) : null,
      product: product ? formatProduct(product) : null,
      price: formatPrice(subscription.items.data[0]?.price),
      invoices: invoices.data
        .map(formatInvoice)
        .filter(Boolean) as NonNullable<Invoice>[],
      upcomingInvoice: upcomingInvoice ? formatInvoice(upcomingInvoice) : null,
    };
  },
});
