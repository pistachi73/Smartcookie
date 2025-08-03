"use client";

import { FolderLibraryIcon } from "@hugeicons-pro/core-solid-rounded";

import { PortalError } from "@/shared/components/layout/portal-error";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HubErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <PortalError
      breadcrumbs={[
        { label: "Portal", href: "/portal" },
        { label: "Hubs", href: "/portal/hubs", icon: FolderLibraryIcon },
        { label: "Error", href: "#" },
      ]}
      error={error}
      onRetry={reset}
      backLink={{
        href: "/portal/hubs",
        label: "Back to Hubs",
      }}
    />
  );
}
