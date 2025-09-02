"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare02Icon } from "@hugeicons-pro/core-stroke-rounded";

import { buttonStyles } from "@/shared/components/ui/button";
import { Link } from "@/shared/components/ui/link";

export const GoToCourseLink = ({ hubId }: { hubId?: number }) => {
  return (
    <Link
      href={`/portal/hubs/${hubId}`}
      className={buttonStyles({
        intent: "outline",
        size: "sm",
      })}
    >
      <span className="hidden @2xl:block">Go to course</span>
      <HugeiconsIcon icon={LinkSquare02Icon} data-slot="icon" size={14} />
    </Link>
  );
};
