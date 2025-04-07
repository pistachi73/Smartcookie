import type React from "react";
import { twMerge } from "tailwind-merge";

interface SkeletonProps extends React.ComponentProps<"div"> {
  soft?: boolean;
}

const Skeleton = ({ ref, soft = true, className, ...props }: SkeletonProps) => {
  return (
    <div
      data-slot="skeleton"
      ref={ref}
      className={twMerge(
        "shrink-0 animate-pulse rounded-lg",
        soft
          ? "bg-overlay-highlight dark:bg-overlay"
          : "bg-overlay dark:bg-overlay-highlight",
        className,
      )}
      {...props}
    />
  );
};

export { Skeleton };
export type { SkeletonProps };
