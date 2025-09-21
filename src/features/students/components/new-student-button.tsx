import { HugeiconsIcon } from "@hugeicons/react";
import { AddIcon } from "@hugeicons-pro/core-stroke-rounded";

import { buttonStyles } from "@/shared/components/ui/button";
import { Link } from "@/shared/components/ui/link";
import { Tooltip } from "@/shared/components/ui/tooltip";
import { useStudentLimits } from "@/shared/hooks/plan-limits/use-student-limits";
import { cn } from "@/shared/lib/classes";

export const NewStudentButton = () => {
  const {
    canCreate,
    isLoading,
    max,
    current,
    isAtLimit,
    remaining,
    isUnlimited,
  } = useStudentLimits();

  const isDisabled = isLoading || !canCreate;

  if (isLoading) {
    return null;
  }

  const getAriaLabel = () => {
    if (isLoading) return "Loading student limits";
    if (isAtLimit)
      return `Student limit reached. ${current} of ${max} students used`;
    return `Create new student${!isUnlimited ? `. ${remaining} remaining` : ""}`;
  };

  const tooltipContent = isAtLimit
    ? `Limit reached: ${current} of ${max} students used`
    : null;
  const shouldShowTooltip = tooltipContent !== null;

  const link = (
    <Link
      className={cn(
        buttonStyles({
          intent: canCreate && !isLoading ? "primary" : "secondary",
        }),
        isDisabled && "cursor-not-allowed opacity-50",
      )}
      href={canCreate && !isLoading ? "/portal/students/new" : "#"}
      aria-disabled={isDisabled}
      aria-label={getAriaLabel()}
    >
      <HugeiconsIcon icon={AddIcon} size={16} />
      <span className="hidden @2xl:block">New Student</span>
    </Link>
  );

  return shouldShowTooltip ? (
    <Tooltip delay={0} closeDelay={0}>
      {link}
      <Tooltip.Content intent={isAtLimit ? "inverse" : "default"}>
        {tooltipContent}
      </Tooltip.Content>
    </Tooltip>
  ) : (
    link
  );
};
