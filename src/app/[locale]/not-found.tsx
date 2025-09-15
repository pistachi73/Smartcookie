"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";

import { buttonStyles } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import { useCurrentUser } from "@/shared/hooks/use-current-user";

export default function NotFound() {
  const user = useCurrentUser();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-white">
      <div className="space-y-3">
        <p className="text-muted-fg text-sm font-medium tracking-wider uppercase">
          404 ERROR
        </p>

        <Heading level={1} className="sm:text-4xl">
          Looks like you got lost...
        </Heading>

        <p className="text-muted-fg text-lg">
          Sorry, the page you are looking for could be not found.
        </p>

        <div className="flex gap-4 pt-4">
          <Link
            href={user ? "/portal/dashboard" : "/"}
            className={buttonStyles({
              intent: "primary",
              size: "lg",
              className: "px-8 h-12 text-base",
            })}
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} data-slot="icon" />
            {user ? "Back to Dashboard" : "Back to Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
