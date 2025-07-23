"use server";

import { Stripe } from "stripe";

import { getUrl } from "@/shared/lib/get-url";

import { env } from "@/env";
import { createDataAccessError, isDataAccessError } from "../errors";
import {
  withAuthenticationNoInput,
  withValidationAndAuth,
  withValidationOnly,
} from "../protected-data-access";
import { updateUser } from "../user/mutations";
import { getUserSubscriptionByUserId } from "../user-subscription/queries";
import {
  createCheckoutSessionSchema,
  createStripeCustomerSchema,
} from "./schemas";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

export const createStripeCustomer = withValidationOnly({
  schema: createStripeCustomerSchema,
  callback: async ({ email, name, userId }) => {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
      });

      await updateUser({
        id: userId,
        data: {
          stripeCustomerId: customer.id,
        },
      });

      return customer;
    } catch (_error) {
      return createDataAccessError(
        "UNEXPECTED_ERROR",
        "Failed to create stripe customer",
      );
    }
  },
});

export const createCheckoutSession = withValidationAndAuth({
  schema: createCheckoutSessionSchema,
  callback: async ({ paymentFrequency }, user) => {
    const existingSubscription = await getUserSubscriptionByUserId({
      userId: user.id,
    });

    if (existingSubscription) {
      return createDataAccessError("USER_ALREADY_HAS_SUBSCRIPTION");
    }

    const priceId =
      paymentFrequency === "M"
        ? env.STRIPE_PRO_MONTHLY_PRICE_ID
        : env.STRIPE_PRO_ANNUAL_PRICE_ID;

    let stripeCustomerId: string;

    if (!user.stripeCustomerId) {
      const userName = user.name ?? user.email;
      const customerResult = await createStripeCustomer({
        email: user.email,
        name: userName,
        userId: user.id,
      });

      if (isDataAccessError(customerResult)) {
        return customerResult;
      }

      stripeCustomerId = customerResult.id;
    } else {
      stripeCustomerId = user.stripeCustomerId;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
      success_url: getUrl("/portal/account?t=subscription"),
      cancel_url: getUrl("/portal/account?t=subscription"),
      subscription_data: {
        trial_period_days: 7,
      },
    });

    if (!checkoutSession.url) {
      return createDataAccessError(
        "UNEXPECTED_ERROR",
        "Could not create checkout session",
      );
    }

    return {
      checkoutSession: {
        id: checkoutSession.id,
        url: checkoutSession.url,
        status: checkoutSession.status,
      },
    };
  },
});

export const createBillingPortalSession = withAuthenticationNoInput({
  callback: async (user) => {
    if (!user.stripeCustomerId) {
      return createDataAccessError(
        "UNEXPECTED_ERROR",
        "User does not have a stripe customer id",
      );
    }
    const billingPortalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: getUrl("/portal/account?t=subscription"),
    });

    if (!billingPortalSession.url) {
      return createDataAccessError(
        "UNEXPECTED_ERROR",
        "Could not create billing portal session",
      );
    }

    return {
      billingPortalSessionUrl: billingPortalSession.url,
    };
  },
});
