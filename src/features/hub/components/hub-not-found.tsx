import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  Folder01Icon,
} from "@hugeicons-pro/core-stroke-rounded";

import { buttonStyles } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Link } from "@/shared/components/ui/link";

import { HubDashboardLayout } from "./hub-dashboard-layout";

export const HubNotFound = () => {
  return (
    <HubDashboardLayout
      hub={{
        name: "Hub not found",
      }}
    >
      <div className="sm:p-6 p-4 pt-0!">
        <EmptyState
          title="Hub not found"
          description="The hub you are looking for does not exist."
          className="bg-white"
          icon={Folder01Icon}
          action={
            <Link
              href="/portal/hubs"
              className={buttonStyles({
                intent: "secondary",
              })}
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} data-slot="icon" />
              Back to courses
            </Link>
          }
        />
      </div>
    </HubDashboardLayout>
  );
};
