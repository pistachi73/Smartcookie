import { HugeiconsIcon } from "@hugeicons/react";
import type { FolderLibraryIcon } from "@hugeicons-pro/core-solid-rounded";

import { Heading } from "@/shared/components/ui/heading";
import { cn } from "@/shared/lib/classes";

type PageHeaderProps = {
  icon: typeof FolderLibraryIcon;
  title: string;
  subTitle?: string;
  actions?: React.ReactNode;
  className?: {
    icon?: string;
    container?: string;
    actionsContainer?: string;
  };
};

export const PageHeader = ({
  icon,
  title,
  subTitle,
  className,
  actions,
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "p-4 sm:p-6 border-b flex flex-col @2xl:flex-row justify-between gap-4 items-start @2xl:items-center",
        className?.container,
      )}
    >
      <div className="flex items-center gap-x-3 sm:gap-x-4">
        <div
          className={cn(
            "size-10 sm:size-12 rounded-lg bg-overlay shadow-md flex items-center justify-center shrink-0",
            className?.icon,
          )}
        >
          <HugeiconsIcon
            icon={icon}
            className="text-primary size-4 sm:size-5"
          />
        </div>
        <div className="flex flex-col w-full">
          <Heading level={1} tracking="tight" className="text-lg">
            {title}
          </Heading>
          {subTitle && (
            <span className="text-muted-fg text-sm">{subTitle}</span>
          )}
        </div>
      </div>
      {actions && (
        <div
          className={cn(
            "flex gap-2 items-center justify-end w-full @2xl:w-auto",
            className?.actionsContainer,
          )}
        >
          {actions}
        </div>
      )}
    </div>
  );
};
