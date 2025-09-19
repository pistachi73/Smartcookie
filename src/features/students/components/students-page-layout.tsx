import { UserGroupIcon } from "@hugeicons-pro/core-solid-rounded";

import { PageHeader } from "@/shared/components/layout/page-header";

import { NewStudentButton } from "./new-student-button";

export const StudentsPageLayout = ({
  children,
}: {
  children?: React.ReactNode;
}) => (
  <div className="space-y-6 p-4 sm:p-6 overflow-y-auto">
    <PageHeader
      title="Students"
      subTitle="Manage your students"
      icon={UserGroupIcon}
      className={{
        container: "border-none p-0!",
      }}
      actions={<NewStudentButton />}
    />
    {children}
  </div>
);
