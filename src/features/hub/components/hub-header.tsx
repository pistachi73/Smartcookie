import { Heading } from "@/shared/components/ui/heading";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export const HubHeader = ({ hubName }: { hubName?: string }) => {
  return (
    <div className="shrink-0 overflow-auto p-6 border-b space-y-4 bg-bg">
      <Link
        href="/portal/hubs"
        className="flex items-center gap-2 text-sm text-muted-fg"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        Back to courses
      </Link>
      {hubName ? (
        <Heading level={1} className="font-bold">
          {hubName}
        </Heading>
      ) : (
        <Skeleton className="h-8 w-64" soft={false} />
      )}
    </div>
  );
};
