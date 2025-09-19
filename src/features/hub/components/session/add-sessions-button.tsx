import type { PressEvent } from "react-aria";

import { Button, type ButtonProps } from "@/shared/components/ui/button";
import { Tooltip } from "@/shared/components/ui/tooltip";
import { useLimitToaster } from "@/shared/hooks/plan-limits/use-limit-toaster";
import { useSessionLimits } from "@/shared/hooks/plan-limits/use-session-limits";
import { cn } from "@/shared/lib/utils";

export const AddSessionsButton = ({
  hubId,
  children,
  onPress,
  isDisabled,
  className,
  ...props
}: ButtonProps & { hubId: number }) => {
  const {
    currentCount,
    maxSessions,
    canCreateSession,
    isLoading,
    remainingCount,
    isUnlimited,
  } = useSessionLimits(hubId);
  const limitToaster = useLimitToaster();

  const disabled = !canCreateSession || isDisabled;

  const onButtonPress = (e: PressEvent) => {
    if (disabled) {
      limitToaster();
      return;
    }
    onPress?.(e);
  };

  const getAriaLabel = () => {
    if (isLoading) return "Loading note limits";
    if (!canCreateSession)
      return `Note limit reached. ${currentCount} of ${maxSessions} notes used`;
    return `Create new note${!isUnlimited ? `. ${remainingCount} remaining` : ""}`;
  };

  const getTooltipContent = () => {
    if (canCreateSession)
      return `You can create ${remainingCount} more sessions for this hub`;
    if (!canCreateSession)
      return `Limit reached: ${currentCount} of ${maxSessions} sessions used for this hub`;
    return null;
  };

  const tooltipContent = getTooltipContent();
  const shouldShowTooltip = tooltipContent !== null;

  const button = (
    <Button
      intent={"primary"}
      onPress={onButtonPress}
      aria-disabled={disabled}
      className={cn(disabled && "cursor-not-allowed opacity-50", className)}
      aria-label={getAriaLabel()}
      {...props}
    >
      {children}
    </Button>
  );

  return shouldShowTooltip ? (
    <Tooltip delay={0} closeDelay={0}>
      {button}
      <Tooltip.Content intent={!canCreateSession ? "inverse" : "default"}>
        {tooltipContent}
      </Tooltip.Content>
    </Tooltip>
  ) : (
    button
  );
};
