import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons-pro/core-stroke-rounded";

import { Badge } from "@/shared/components/ui/badge";
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
  onToggleAllSessionsExpanded: () => void;
  /** Whether all sessions are expanded */
  allSessionsExpanded: boolean;
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
  onToggleAllSessionsExpanded,
  allSessionsExpanded,
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
        "@container flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3 bg-muted/50 rounded-lg w-full",
        className,
      )}
    >
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Load Past Sessions Button */}
        <Button
          intent="outline"
          size="sm"
          onPress={onFetchPrevious}
          isDisabled={!hasPrevious || isLoadingPrevious}
          className="w-full sm:w-fit text-xs sm:text-sm justify-center sm:justify-start"
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
          <span className="hidden sm:inline">
            {!hasPrevious && !isLoadingPrevious
              ? "No previous sessions"
              : "See previous sessions"}
          </span>
          <span className="sm:hidden">
            {!hasPrevious && !isLoadingPrevious ? "No previous" : "Previous"}
          </span>
        </Button>

        {/* Load Future Sessions Button */}
        <Button
          intent="outline"
          size="sm"
          onPress={onFetchNext}
          isDisabled={!hasNext || isLoadingNext}
          className="w-full sm:w-fit text-xs sm:text-sm justify-center sm:justify-start"
        >
          <span className="hidden sm:inline">
            {!hasNext && !isLoadingNext
              ? "No upcoming sessions"
              : "See upcoming sessions"}
          </span>
          <span className="sm:hidden">
            {!hasNext && !isLoadingNext ? "No upcoming" : "Upcoming"}
          </span>
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
      <div className=" items-center gap-2 w-full sm:w-auto hidden sm:flex">
        <Badge
          intent="outline"
          isCircle={false}
          className="hidden @2xl:block text-muted-fg"
        >
          {getSessionCountText()} loaded
        </Badge>
        <Button
          intent="outline"
          size="sm"
          onPress={onToggleAllSessionsExpanded}
          className="block"
        >
          {allSessionsExpanded ? "Collapse all" : "Expand all"}
        </Button>
      </div>
    </div>
  );
};
