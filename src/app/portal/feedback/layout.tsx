import { Comment01Icon } from "@hugeicons-pro/core-solid-rounded";
import type { ReactNode } from "react";

import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

import { FeedbackHeader } from "@/features/feedback/components/feedback-header";

export default async function FeedbackLayout({
  children: _children,
  sidebar,
  details,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  details: ReactNode;
}) {
  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          {
            label: "Feedback",
            href: "/portal/feedback",
            icon: Comment01Icon,
          },
        ]}
      />
      <div className="min-h-0 h-full flex flex-col overflow-hidden relative">
        <FeedbackHeader />
        <div className="h-full grid grid-cols-[minmax(450px,1fr)_3fr] overflow-hidden">
          {sidebar}
          <section className="overflow-y-auto ">
            <div className="max-w-2xl mx-auto p-6 pt-8 w-full pb-20">
              {details}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
