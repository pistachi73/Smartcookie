"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";

import { buttonStyles } from "@/shared/components/ui/button";
import { Link } from "@/shared/components/ui/link";

export const BackToHomePageButton = () => {
  return (
    <Link
      href={"/"}
      className={(renderProps) =>
        buttonStyles({
          ...renderProps,
          intent: "plain",
          size: "sm",
          className: "absolute top-4 left-4",
        })
      }
    >
      <HugeiconsIcon icon={ArrowLeft02Icon} size={16} className="mr-2" />
      Back to home page
    </Link>
  );
};
