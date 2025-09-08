import { HugeiconsIcon } from "@hugeicons/react";
import type { Comment01Icon } from "@hugeicons-pro/core-solid-rounded";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";

import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import { cn } from "@/shared/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: typeof Comment01Icon;
  action?: React.ReactNode;
  backLink?: {
    label: string;
    href: string;
  };
  className?: string;
  minHeight?: string;
}

export const EmptyState = ({
  title,
  description,
  icon: Icon,
  action,
  backLink,
  className = "",
}: EmptyStateProps) => {
  return (
    <div className={cn("space-y-6")}>
      {backLink && (
        <Link
          intent="secondary"
          href={backLink.href}
          className="flex items-center gap-1.5 text-sm"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={18} data-slot="icon" />

          {backLink.label}
        </Link>
      )}

      <div
        className={cn(
          "flex items-center justify-center bg-muted/30 p-6 rounded-lg border border-dashed",
          className,
        )}
      >
        <div className="text-center space-y-4">
          {Icon && (
            <div className="p-4 rounded-full bg-muted w-fit mx-auto">
              <HugeiconsIcon icon={Icon} size={18} className="text-muted-fg" />
            </div>
          )}
          <div className="space-y-1">
            <Heading level={4}>{title}</Heading>
            <p className="text-sm text-muted-fg max-w-[42ch]">{description}</p>
          </div>
          {action}
        </div>
      </div>
    </div>
  );
};
