"use client";

import { UserGroupIcon } from "@hugeicons-pro/core-solid-rounded";

import { PageHeader } from "@/shared/components/layout/page-header";

export type StudentProfileLayoutProps = {
  children?: React.ReactNode;
};

export const StudentProfileLayout = ({
  children,
}: StudentProfileLayoutProps) => (
  <div className="space-y-6 p-4 sm:p-6">
    <PageHeader
      title="Student Profile"
      subTitle="Manage student information and track progress"
      icon={UserGroupIcon}
      className={{
        container: "border-none p-0!",
      }}
    />
    <div className="@container">{children}</div>
  </div>
);
