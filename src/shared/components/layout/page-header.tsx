import { Heading } from "@/shared/components/ui/heading";
import { cn } from "@/shared/lib/classes";
import type { FolderLibraryIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

type PageHeaderProps = {
  icon: typeof FolderLibraryIcon;
  title: string;
  subTitle?: string;
  actions?: React.ReactNode;
  className?: {
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
        "p-5 border-b flex flex-col @2xl:flex-row justify-between gap-4 items-start @2xl:items-center",
        className?.container,
      )}
    >
      <div className="flex items-center gap-x-4">
        <div className="size-12 rounded-lg bg-overlay shadow-md flex items-center justify-center">
          <HugeiconsIcon icon={icon} size={20} className="text-primary" />
        </div>
        <div className="flex flex-col">
          <Heading level={1} tracking="tight">
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
