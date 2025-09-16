import { HugeiconsIcon } from "@hugeicons/react";
import { FolderAddIcon } from "@hugeicons-pro/core-stroke-rounded";

import { buttonStyles } from "@/shared/components/ui/button";
import { Link } from "@/shared/components/ui/link";
import { useHubLimits } from "@/shared/hooks/plan-limits/use-hub-limits";
import { useLimitToaster } from "@/shared/hooks/plan-limits/use-limit-toaster";
import { cn } from "@/shared/lib/classes";

export const NewHubButton = () => {
  const {
    canCreate,
    isLoading,
    max,
    current,
    isAtLimit,
    remaining,
    isUnlimited,
  } = useHubLimits();
  const limitToaster = useLimitToaster({ resourceType: "hub" });

  const isDisabled = isLoading || !canCreate;

  const handleClick = (e: React.MouseEvent) => {
    if (isDisabled) {
      e.preventDefault();
      limitToaster();
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Loading...";
    if (isAtLimit) return `Hub limit reached (${max})`;
    if (!isUnlimited && remaining <= 2) return `New Hub (${remaining} left)`;
    return "New Hub";
  };

  const getAriaLabel = () => {
    if (isLoading) return "Loading hub limits";
    if (isAtLimit) return `Hub limit reached. ${current} of ${max} hubs used`;
    return `Create new hub${!isUnlimited ? `. ${remaining} remaining` : ""}`;
  };

  return (
    <Link
      className={cn(
        buttonStyles({
          intent: canCreate && !isLoading ? "primary" : "secondary",
          size: "sm",
        }),
        "px-0 size-10 @2xl:h-10 @2xl:w-auto @2xl:px-4",
        isDisabled && "cursor-not-allowed opacity-50",
      )}
      href={canCreate && !isLoading ? "/portal/hubs/new" : "#"}
      onClick={handleClick}
      isDisabled={isDisabled}
      aria-label={getAriaLabel()}
    >
      <HugeiconsIcon icon={FolderAddIcon} size={16} />
      <span className="hidden @2xl:block">{getButtonText()}</span>
    </Link>
  );
};
