"use client";

import { Link, buttonStyles } from "@/components/ui";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

export const BackToHomePageButton = () => {
  return (
    <Link
      href={"/"}
      className={(renderProps) =>
        buttonStyles({
          ...renderProps,
          appearance: "plain",
          size: "small",
          className: "absolute top-4 left-4",
        })
      }
    >
      <HugeiconsIcon icon={ArrowLeft02Icon} size={16} className="mr-2" />
      Back to home page
    </Link>
  );
};
