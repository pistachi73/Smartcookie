"use client";

import { UserIcon } from "@hugeicons-pro/core-solid-rounded";

import { PageHeader } from "@/shared/components/layout/page-header";

export type StudentProfileLayoutProps = {
  children?: React.ReactNode;
};

export const StudentProfileLayout = ({
  children,
}: StudentProfileLayoutProps) => (
  <div className="space-y-6 p-4 sm:p-6 overflow-y-auto">
    <PageHeader
      title="Student Profile"
      subTitle="Manage student information and track progress"
      icon={UserIcon}
      className={{
        container: "border-none p-0!",
      }}
    />
    <div className="@container min-h-0">{children}</div>
  </div>
);
