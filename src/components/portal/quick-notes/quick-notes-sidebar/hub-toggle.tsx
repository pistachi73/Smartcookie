import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Folder02Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "react-aria-components";
import { tv } from "tailwind-variants";

type HubToggleProps = {
  label: string;
  isVisible: boolean;
  isMinimized: boolean;
  onPress: () => void;
  icon?: typeof Folder02Icon;
};

const toggleStyles = tv({
  base: "relative group px-3 h-10 w-full cursor-pointer rounded-lg border transition-colors justify-between",
  variants: {
    isVisible: {
      true: "bg-primary/15 border-primary/50",
      false: "bg-overlay-highlight border-transparent",
    },
  },
});

export function HubToggle({
  label,
  isVisible,
  isMinimized,
  onPress,
  icon: Icon = Folder02Icon,
}: HubToggleProps) {
  if (isMinimized) {
    return (
      <Tooltip delay={0}>
        <Tooltip.Trigger
          className={toggleStyles({ isVisible })}
          onPress={onPress}
        >
          <HugeiconsIcon
            icon={Icon}
            size={18}
            className={cn(
              "transition-colors",
              !isVisible && "text-muted-fg group-hover:text-secondary-fg",
            )}
          />
        </Tooltip.Trigger>
        <Tooltip.Content intent="inverse" placement="right">
          {label}
        </Tooltip.Content>
      </Tooltip>
    );
  }

  return (
    <Button
      type="button"
      onPress={onPress}
      className={toggleStyles({ isVisible })}
      aria-pressed={isVisible}
    >
      <h3
        className={cn(
          "line-clamp-1 text-sm font-medium text-left transition-colors",
          !isVisible && "text-muted-fg group-hover:text-secondary-fg",
        )}
      >
        {label}
      </h3>
    </Button>
  );
}
