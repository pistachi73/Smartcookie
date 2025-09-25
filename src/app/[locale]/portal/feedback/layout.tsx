import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PremiumLockedSection } from "@/shared/components/premium-locked-section";
import { currentUser } from "@/shared/lib/auth";
import { generatePortalMetadata } from "@/shared/lib/generate-metadata";

import { getPlanLimits } from "@/core/config/plan-limits";
import { FeedbackHeader } from "@/features/feedback/components/feedback-header";

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePortalMetadata({ namespace: "Metadata.Feedback" });
};

export default async function FeedbackLayout({
  children: _children,
  sidebar,
  details,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  details: ReactNode;
}) {
  const user = await currentUser();
  const limits = getPlanLimits(user?.subscriptionTier);

  if (!limits.features.feedbackProgressTracking) {
    return (
      <div className="min-h-0 h-full flex flex-col overflow-hidden relative">
        <FeedbackHeader isBlocked={true} />
        <div className="flex pt-40 justify-center p-6 bg-white h-full">
          <PremiumLockedSection
            className="h-fit"
            title="Feedback Progress Tracking"
            description="Track student progress, analyze feedback patterns, and generate detailed reports with our advanced feedback system. Available with Premium."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 h-full flex flex-col overflow-hidden relative">
      <FeedbackHeader />
      <div className="h-full grid grid-cols-[minmax(450px,1fr)_3fr] overflow-hidden bg-white">
        {sidebar}
        <section className="overflow-y-auto ">
          <div className="max-w-2xl mx-auto p-6 pt-8 w-full pb-20">
            {details}
          </div>
        </section>
      </div>
    </div>
  );
}
