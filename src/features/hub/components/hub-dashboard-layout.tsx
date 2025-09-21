import { HugeiconsIcon } from "@hugeicons/react";
import {
  Archive02Icon,
  ArrowLeft02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { div } from "motion/react-m";

import { Badge } from "@/shared/components/ui/badge";
import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";
import { cn } from "@/shared/lib/utils";

import type { CustomColor, HubStatus } from "@/db/schema";
import { UpgradePlanButton } from "./upgrade-plan-button";

export type HubDashboardLayoutProps = {
  hub?: {
    name: string;
    color?: CustomColor;
    status?: HubStatus;
  };
  children?: React.ReactNode;
};

export const HubDashboardLayout = ({
  children,
  hub,
}: HubDashboardLayoutProps) => {
  const colorClasses = getCustomColorClasses(hub?.color ?? "neutral");

  return (
    <div className="h-full overflow-auto flex flex-col bg-bg @container">
      <div className="shrink-0 overflow-auto sm:p-6 p-4 space-y-4 bg-bg">
        <Link
          href="/portal/hubs"
          className="flex items-center gap-2 text-sm text-muted-fg"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
          Back to courses
        </Link>
        {hub ? (
          <div className="flex flex-col @2xl:flex-row 2xl:items-end gap-4 justify-between w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <div
                className={cn(
                  "size-3 rounded-full border",
                  colorClasses.bg,
                  colorClasses.border,
                )}
              />
              <Heading level={1} className="font-bold">
                {hub.name}
              </Heading>
              {hub.status && (
                <Badge
                  className="text-sm ml-1 px-2 py-1"
                  intent={hub.status === "active" ? "success" : "secondary"}
                >
                  {hub.status === "inactive" && (
                    <HugeiconsIcon icon={Archive02Icon} size={14} />
                  )}
                  {hub.status === "active" ? "Active" : "Archived (view only)"}
                </Badge>
              )}
            </div>
            <UpgradePlanButton intent="primary" />
          </div>
        ) : (
          <Skeleton className="h-7 sm:h-8 w-64" soft={false} />
        )}
      </div>

      {children}
    </div>
  );
};
