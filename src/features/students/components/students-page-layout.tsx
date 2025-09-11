import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  UserGroupIcon,
} from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";
import { PageHeader } from "@/shared/components/layout/page-header";

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
      actions={
        <Button>
          <HugeiconsIcon icon={PlusSignIcon} data-slot="icon" />
          Add student
        </Button>
      }
    />
    {children}
  </div>
);
