import { PageHeader } from "@/shared/components/layout/page-header";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { Button } from "@/shared/components/ui/button";
import { Comment01Icon } from "@hugeicons-pro/core-solid-rounded";
import { AddIcon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

export default function FeedbackLayout({
  children,
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
        <PageHeader
          title="Feedback"
          subTitle="Manage your feedback"
          icon={Comment01Icon}
          className={{
            container: "bg-bg",
          }}
          actions={
            <Button>
              <HugeiconsIcon icon={AddIcon} size={16} data-slot="icon" />
              Add Question
            </Button>
          }
        />
        <div className="h-full grid grid-cols-[minmax(450px,1fr)_3fr] overflow-hidden">
          {sidebar}
          <section className="overflow-y-auto ">
            <div className="max-w-2xl mx-auto p-6 pt-8 w-full">{details}</div>
          </section>
        </div>
      </div>
    </>
  );
}
