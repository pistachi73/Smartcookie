import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon } from "@hugeicons-pro/core-stroke-rounded";
import { Button } from "react-aria-components";
import { tv } from "tailwind-variants";

import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";

import type { CustomColor } from "@/db/schema/shared";

type HubToggleProps = {
  label: string;
  isVisible: boolean;
  onPress: () => void;
  color?: CustomColor;
  prefix?: React.ReactNode | "dot";
  className?: string;
  isViewOnlyMode?: boolean;
};

const toggleStyles = tv({
  base: [
    "border  relative group cursor-pointer px-3 h-10 w-full rounded-lg transition-all justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "flex items-center gap-2 hover:shadow-sm",
    "ring-offset-bg dark:ring-offset-overlay",
  ],
  variants: {
    isVisible: {
      true: "", // We'll apply color classes dynamically
      false: "bg-overlay dark:bg-overlay-highlight focus-visible:ring-primary",
    },
  },
});

const dotStyles = "size-2.5 rounded-full border shrink-0";

export function HubToggle({
  label,
  isViewOnlyMode = false,
  isVisible,
  onPress,
  color,
  prefix,
  className,
}: HubToggleProps) {
  // Always get color classes regardless of visibility state
  const colorClasses = getCustomColorClasses(color ?? "neutral");
  const showDot = Boolean(prefix);

  return (
    <Button
      type="button"
      onPress={onPress}
      className={cn(
        toggleStyles({ isVisible }),
        color ? colorClasses?.focusVisible : "focus-visible:ring-primary",
        isVisible && (color ? colorClasses?.bg : "bg-secondary "),
        isVisible && (color ? colorClasses?.border : "border-border"),
        className,
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
          "line-clamp-1 text-sm font-medium text-left transition-colors grow",
          isVisible
            ? `${colorClasses?.text}`
            : "text-muted-fg group-hover:text-secondary-fg",
        )}
      >
        {label}
      </h3>
      {isViewOnlyMode && (
        <HugeiconsIcon icon={ViewIcon} size={16} className="text-muted-fg" />
      )}
    </Button>
  );
}
