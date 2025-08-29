"use client";

import { UserGroupIcon } from "@hugeicons-pro/core-solid-rounded";

import { PageHeader } from "@/shared/components/layout/page-header";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

export type StudentProfileLayoutProps = {
  children?: React.ReactNode;
} & (
  | {
      studentId?: never;
      studentName?: never;
      isLoading: true;
    }
  | {
      studentId: number;
      studentName: string;
      isLoading: false;
    }
);

export const StudentProfileLayout = ({
  children,
  studentId,
  studentName,
  isLoading,
}: StudentProfileLayoutProps) => (
  <>
    <PortalNav
      breadcrumbs={[
        { label: "Portal", href: "/portal" },
        { label: "Students", href: "/portal/students", icon: UserGroupIcon },
        isLoading
          ? "skeleton"
          : { label: studentName, href: `/portal/students/${studentId}` },
      ]}
    />

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
  </>
);
