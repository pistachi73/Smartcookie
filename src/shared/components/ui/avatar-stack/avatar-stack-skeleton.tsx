"use client";

import { tv, type VariantProps } from "tailwind-variants";

import { Skeleton } from "../skeleton";

const avatarStackSkeleton = tv({
  base: "flex",
  variants: {
    spacing: {
      tight: "-space-x-2.5",
      normal: "-space-x-1.5",
      loose: "-space-x-0.5",
    },
    size: {
      "extra-small": "",
      small: "",
      medium: "",
      large: "",
      "extra-large": "",
    },
  },
  defaultVariants: {
    spacing: "normal",
    size: "medium",
  },
});

const avatarSkeletonSize = tv({
  base: "rounded-full",
  variants: {
    size: {
      "extra-small": "h-5 w-5",
      small: "h-6 w-6",
      medium: "h-8 w-8",
      large: "h-10 w-10",
      "extra-large": "h-12 w-12",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export type AvatarStackSkeletonProps = VariantProps<
  typeof avatarStackSkeleton
> & {
  maxAvatars?: number;
  className?: {
    container?: string;
    avatar?: string;
  };
};

export const AvatarStackSkeleton = ({
  maxAvatars = 5,
  spacing = "normal",
  size = "medium",
  className,
}: AvatarStackSkeletonProps) => {
  const avatarCount = Math.min(maxAvatars, 3);

  return (
    <div
      className={avatarStackSkeleton({
        spacing,
        size,
        className: className?.container,
      })}
      data-testid="avatar-stack-skeleton"
    >
      {Array.from({ length: avatarCount }).map((_, index) => (
        <Skeleton
          key={index}
          className={avatarSkeletonSize({
            size,
            className: className?.avatar,
          })}
        />
      ))}
    </div>
  );
};
