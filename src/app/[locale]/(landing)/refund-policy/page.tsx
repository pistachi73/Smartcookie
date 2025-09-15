"use client";

import { Heading } from "@/shared/components/ui/heading";
import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";

export default function RefundPolicyPage() {
  return (
    <div className="p-[2%] md:p-6 bg-white space-y-24 pb-24!">
      <div className="rounded-b-2xl p-6 py-24 pt-42 bg-zinc-800 -mt-24">
        <MaxWidthWrapper className="py-8 lg:py-12">
          <Heading
            level={1}
            className="text-2xl sm:text-4xl text-bg text-center mb-12"
          >
            Refund Policy
          </Heading>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper className="prose max-w-4xl">
        <div className="text-muted-fg space-y-8">
          <section className="mb-8">
            <p className="text-lg mb-6">
              At SmartCookie, we want you to feel confident in your purchase.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              1. 14-Day Money-Back Guarantee
            </Heading>
            <p>
              If you are not satisfied with your subscription, you may request a
              full refund within 14 days of your initial payment. No questions
              asked.
            </p>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              2. Subscriptions and Renewals
            </Heading>
            <div className="space-y-4">
              <p>
                Your subscription renews automatically at the end of each
                billing cycle (monthly or yearly, depending on your plan).
              </p>
              <p>
                Refunds are not provided for renewal payments once a new billing
                cycle has started. To avoid renewal charges, you can cancel your
                subscription at any time before the renewal date.
              </p>
            </div>
          </section>

          <section>
            <Heading level={2} className="sm:text-2xl mb-4">
              3. How to Request a Refund
            </Heading>
            <p>
              To request a refund, please contact us at{" "}
              <a
                href="mailto:infomartinamotiva@gmail.com"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                infomartinamotiva@gmail.com
              </a>{" "}
              with your account email and payment details. Refunds will be
              processed back to your original payment method within 5–10
              business days.
            </p>
          </section>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
