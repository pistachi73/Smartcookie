import { HugeiconsIcon } from "@hugeicons/react";
import type { Comment01Icon } from "@hugeicons-pro/core-solid-rounded";

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
    icon?: typeof Comment01Icon;
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
    <div className={cn("space-y-6", className)}>
      {backLink && (
        <Link
          intent="secondary"
          href={backLink.href}
          className="flex items-center gap-1.5 text-sm"
        >
          {backLink.icon && (
            <HugeiconsIcon icon={backLink.icon} size={18} data-slot="icon" />
          )}
          {backLink.label}
        </Link>
      )}

      <div className={"flex items-center justify-center"}>
        <div className="text-center space-y-4">
          {Icon && (
            <div className="p-4 rounded-full bg-muted w-fit mx-auto">
              <HugeiconsIcon icon={Icon} size={18} className="text-muted-fg" />
            </div>
          )}
          <div className="space-y-1">
            <Heading level={3}>{title}</Heading>
            <p className="text-sm text-muted-fg">{description}</p>
          </div>
          {action}
        </div>
      </div>
    </div>
  );
};
