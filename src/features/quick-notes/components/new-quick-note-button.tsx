import type { PressEvent } from "react-aria";

import { Button, type ButtonProps } from "@/shared/components/ui/button";
import { Tooltip } from "@/shared/components/ui/tooltip";
import { useLimitToaster } from "@/shared/hooks/plan-limits/use-limit-toaster";
import { useNotesLimits } from "@/shared/hooks/plan-limits/use-notes-limits";
import { cn } from "@/shared/lib/classes";

export const NewQuickNoteButton = ({
  children,
  onPress,
  isDisabled,
  className,
  ...props
}: ButtonProps) => {
  const {
    isLoading,
    isAtLimit,
    current,
    max,
    isUnlimited,
    remaining,
    canCreate,
  } = useNotesLimits();
  const disabled = isLoading || !canCreate || isDisabled;

  const onButtonPress = (e: PressEvent) => {
    if (disabled) {
      return;
    }
    onPress?.(e);
  };

  const getAriaLabel = () => {
    if (isLoading) return "Loading note limits";
    if (isAtLimit) return `Note limit reached. ${current} of ${max} notes used`;
    return `Create new note${!isUnlimited ? `. ${remaining} remaining` : ""}`;
  };

  const getTooltipContent = () => {
    if (isAtLimit) return `Limit reached: ${current} of ${max} notes used`;
    return null;
  };

  const tooltipContent = getTooltipContent();
  const shouldShowTooltip = tooltipContent !== null;

  const button = (
    <Button
      className={cn(disabled && "cursor-not-allowed opacity-50", className)}
      onPress={(e) => onButtonPress(e)}
      aria-label={getAriaLabel()}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );

  return shouldShowTooltip ? (
    <Tooltip delay={0} closeDelay={0}>
      {button}
      <Tooltip.Content intent={isAtLimit ? "inverse" : "default"}>
        {tooltipContent}
      </Tooltip.Content>
    </Tooltip>
  ) : (
    button
  );
};
