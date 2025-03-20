import { Tooltip } from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/classes";
import type { CustomColor } from "@/shared/lib/custom-colors";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";
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
  color?: CustomColor;
};

const toggleStyles = tv({
  base: "ring-offset-overlay relative group cursor-pointer rounded-lg transition-colors justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  variants: {
    isVisible: {
      true: "", // We'll apply color classes dynamically
      false:
        "bg-overlay-highlight border-transparent focus-visible:ring-primary",
    },
    isMinimized: {
      true: "size-10",
      false: "px-3 h-10 w-full",
    },
  },
});

const dotStyles = "size-2.5 rounded-full border flex-shrink-0";

export function HubToggle({
  label,
  isVisible,
  isMinimized,
  onPress,
  icon: Icon = Folder02Icon,
  color,
}: HubToggleProps) {
  // Always get color classes regardless of visibility state
  const colorClasses = color ? getCustomColorClasses(color) : null;
  const showDot = !!colorClasses;

  if (isMinimized) {
    return (
      <Tooltip delay={0}>
        <Tooltip.Trigger
          className={cn(
            toggleStyles({ isVisible, isMinimized }),
            colorClasses?.focusVisible ?? "focus-visible:ring-primary",
            isVisible && [colorClasses?.bg ?? "bg-overlay-elevated-highlight"],
            "relative flex items-center justify-center",
          )}
          onPress={onPress}
        >
          <div className="relative">
            {/* Icon */}
            <HugeiconsIcon
              icon={Icon}
              size={18}
              className={cn(
                "transition-colors",
                isVisible
                  ? colorClasses?.text
                  : "text-muted-fg group-hover:text-secondary-fg",
              )}
            />

            {/* Color dot indicator (top right of icon) */}
            {showDot && (
              <div
                className={cn(
                  "absolute -top-1.5 -right-1.5 size-2.5 rounded-full border",
                  colorClasses.dot,
                  colorClasses.border,
                )}
                aria-hidden="true"
              />
            )}
          </div>
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
      className={cn(
        toggleStyles({ isVisible, isMinimized }),
        colorClasses?.focusVisible ?? "focus-visible:ring-primary",
        isVisible && (colorClasses?.bg ?? "bg-overlay-elevated-highlight"),
        "flex items-center gap-2",
      )}
      aria-pressed={isVisible}
    >
      {/* Color dot indicator (left of text) */}
      {showDot && (
        <div
          className={cn(dotStyles, colorClasses.dot, colorClasses.border)}
          aria-hidden="true"
        />
      )}

      <h3
        className={cn(
          "line-clamp-1 text-sm font-medium text-left transition-colors flex-grow",
          isVisible
            ? colorClasses?.text
            : "text-muted-fg group-hover:text-secondary-fg",
        )}
      >
        {label}
      </h3>
    </Button>
  );
}
