"use client";

import { Link, buttonStyles } from "@/components/ui/new/ui";
import { ArrowLeft02Icon } from "@hugeicons/react";

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
      <ArrowLeft02Icon size={16} className="mr-2" />
      Back to home page
    </Link>
  );
};
