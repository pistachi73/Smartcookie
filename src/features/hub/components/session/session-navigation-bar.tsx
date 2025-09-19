import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { cn } from "@/shared/lib/utils";

interface SessionNavigationBarProps {
  /** Function to fetch previous sessions */
  onFetchPrevious: () => void;
  /** Function to fetch future sessions */
  onFetchNext: () => void;
  /** Whether previous sessions are available */
  hasPrevious: boolean;
  /** Whether future sessions are available */
  hasNext: boolean;
  /** Whether previous sessions are currently loading */
  isLoadingPrevious: boolean;
  /** Whether future sessions are currently loading */
  isLoadingNext: boolean;
  /** Total number of sessions currently loaded */
  totalSessions: number;
  /** Optional className for the container */
  className?: string;
}

export const SessionNavigationBar = ({
  onFetchPrevious,
  onFetchNext,
  hasPrevious,
  hasNext,
  isLoadingPrevious,
  isLoadingNext,
  totalSessions,
  className,
}: SessionNavigationBarProps) => {
  const getSessionCountText = () => {
    if (totalSessions === 0) return "No sessions";
    if (totalSessions === 1) return "1 session";
    return `${totalSessions} sessions`;
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 p-4 w-fit",
        className,
      )}
    >
      {/* Load Past Sessions Button */}
      <Button
        intent="outline"
        size="sm"
        onPress={onFetchPrevious}
        isDisabled={!hasPrevious || isLoadingPrevious}
        className="flex-shrink-0"
      >
        {isLoadingPrevious ? (
          <ProgressCircle
            className="size-4"
            isIndeterminate
            aria-label="Loading past sessions"
          />
        ) : (
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            data-slot="icon"
            className="size-4"
          />
        )}
        Load past sessions{" "}
        {!hasPrevious && !isLoadingPrevious && "(none available)"}
      </Button>

      {/* Sessions Count Indicator */}
      <div className="flex-1 text-center">
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {getSessionCountText()} loaded
        </span>
      </div>

      {/* Load Future Sessions Button */}
      <Button
        intent="outline"
        size="sm"
        onPress={onFetchNext}
        isDisabled={!hasNext || isLoadingNext}
        className="flex-shrink-0"
      >
        Load future sessions {!hasNext && !isLoadingNext && "(none available)"}
        {isLoadingNext ? (
          <ProgressCircle
            className="size-4"
            isIndeterminate
            aria-label="Loading future sessions"
          />
        ) : (
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            data-slot="icon"
            className="size-4"
          />
        )}
      </Button>
    </div>
  );
};
