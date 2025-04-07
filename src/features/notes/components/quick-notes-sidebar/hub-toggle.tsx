import type { CustomColor } from "@/db/schema/shared";
import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";
import { Tooltip } from "@/ui/tooltip";
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
  prefix?: React.ReactNode | "dot";
};

const toggleStyles = tv({
  base: [
    "border  relative group cursor-pointer rounded-lg transition-all justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "flex items-center gap-2 hover:shadow-sm",
    "ring-offset-bg dark:ring-offset-overlay",
  ],
  variants: {
    isVisible: {
      true: "", // We'll apply color classes dynamically
      false: "bg-overlay dark:bg-overlay-highlight focus-visible:ring-primary",
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
  prefix = "dot",
}: HubToggleProps) {
  // Always get color classes regardless of visibility state
  const toggleColor = color ?? "neutral";
  const colorClasses = getCustomColorClasses(toggleColor);
  const showDot = prefix === "dot";

  if (isMinimized) {
    return (
      <Tooltip delay={0}>
        <Tooltip.Trigger
          className={cn(
            toggleStyles({ isVisible, isMinimized }),
            colorClasses?.focusVisible ?? "focus-visible:ring-primary",
            isVisible && [colorClasses?.bg ?? "bg-overlay-elevated-highlight"],
            isVisible && [colorClasses?.border ?? "border-primary"],
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
        isVisible && (colorClasses?.border ?? "border-primary"),
      )}
      aria-pressed={isVisible}
    >
      {/* Color dot indicator (left of text) */}
      {showDot ? (
        <div
          className={cn(dotStyles, colorClasses.dot, colorClasses.border)}
          aria-hidden="true"
        />
      ) : (
        prefix
      )}

      <h3
        className={cn(
          "line-clamp-1 text-sm font-medium text-left transition-colors flex-grow",
          isVisible
            ? `${colorClasses?.text}`
            : "text-muted-fg group-hover:text-secondary-fg",
        )}
      >
        {label}
      </h3>
    </Button>
  );
}
