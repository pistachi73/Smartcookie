import type { PressEvent } from "react-aria";

import { Button, type ButtonProps } from "@/shared/components/ui/button";
import { Tooltip } from "@/shared/components/ui/tooltip";
import { useHubLimits } from "@/shared/hooks/plan-limits/use-hub-limits";
import { cn } from "@/shared/lib/classes";

import { useRouter } from "@/i18n/navigation";

export const NewHubButton = ({
  children,
  onPress,
  isDisabled: isDisabledProp,
  className,
  ...props
}: ButtonProps) => {
  const {
    canCreate,
    isLoading,
    max,
    current,
    isAtLimit,
    remaining,
    isUnlimited,
  } = useHubLimits();
  const router = useRouter();

  const isDisabled = isLoading || !canCreate || isDisabledProp;
  const onButtonPress = (e: PressEvent) => {
    if (isDisabled) {
      return;
    }
    router.push("/portal/hubs/new");
    onPress?.(e);
  };
  const getAriaLabel = () => {
    if (isLoading) return "Loading hub limits";
    if (isAtLimit) return `Hub limit reached. ${current} of ${max} hubs used`;
    return `Create new hub${!isUnlimited ? `. ${remaining} remaining` : ""}`;
  };

  const tooltipContent = isAtLimit
    ? `Limit reached: ${current} of ${max} hubs used`
    : null;
  const shouldShowTooltip = tooltipContent !== null;

  const button = (
    <Button
      intent={canCreate && !isLoading ? "primary" : "secondary"}
      className={cn(
        isDisabled && "cursor-not-allowed opacity-50",
        className,
      )}
      onPress={onButtonPress}
      aria-disabled={isDisabled}
      aria-label={getAriaLabel()}
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
