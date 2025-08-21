"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowLeft02Icon,
  RefreshIcon,
} from "@hugeicons-pro/core-solid-rounded";
import Link from "next/link";
import type { ComponentProps } from "react";

import { Button, buttonStyles } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";

import { PortalNav } from "./portal-nav/portal-nav";

interface PortalErrorProps {
  /** Breadcrumbs for the PortalNav component */
  breadcrumbs: ComponentProps<typeof PortalNav>["breadcrumbs"];
  /** Error object with message and optional digest */
  error?: Error & { digest?: string };
  /** Function to retry the failed operation */
  onRetry?: () => void;
  /** Optional back link configuration */
  backLink?: {
    href: string;
    label: string;
  };
  /** Custom error title */
  title?: string;
  /** Custom error message */
  message?: string;
}

export function PortalError({
  breadcrumbs,
  error,
  onRetry,
  backLink,
  title = "Something went wrong",
  message,
}: PortalErrorProps) {
  return (
    <>
      <PortalNav breadcrumbs={breadcrumbs} />
      <div className="bg-bg h-full px-4">
        <div className="max-h-[800px] flex flex-col items-center justify-center space-y-8 w-full h-full">
          <div className="text-center space-y-6 max-w-lg">
            <div className="mx-auto h-24 w-24 rounded-full bg-danger flex items-center justify-center">
              <HugeiconsIcon
                icon={Alert02Icon}
                size={48}
                className="text-danger-fg"
              />
            </div>

            <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500 delay-200">
              <Heading level={1} className="">
                {title}
              </Heading>
              {message && (
                <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                  {message}
                </p>
              )}
            </div>

            {process.env.NODE_ENV === "development" && error && (
              <details className="mt-6 text-left animate-in slide-in-from-bottom-2 duration-500 delay-300">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 select-none">
                  Error details (development only)
                </summary>
                <pre className="mt-3 text-xs bg-muted/50 p-4 rounded-lg overflow-auto max-w-md border border-border/50 font-mono">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-4 duration-500 delay-400">
            {onRetry && (
              <Button onPress={onRetry} size="lg" intent="primary">
                <HugeiconsIcon icon={RefreshIcon} size={16} data-slot="icon" />
                Try again
              </Button>
            )}

            {backLink && (
              <Link
                href={backLink.href}
                className={buttonStyles({
                  intent: "outline",
                  size: "lg",
                })}
              >
                <HugeiconsIcon
                  icon={ArrowLeft02Icon}
                  size={16}
                  data-slot="icon"
                />
                {backLink.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
