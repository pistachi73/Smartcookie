"use client";

import { PortalError } from "@/shared/components/layout/portal-error";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HubErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <PortalError
      error={error}
      onRetry={reset}
      backLink={{
        href: "/portal/dashboard",
        label: "Back to Dashboard",
      }}
    />
  );
}
