"use client";

import { FolderLibraryIcon } from "@hugeicons-pro/core-solid-rounded";

import { PageHeader } from "@/shared/components/layout/page-header";

import { HubCardSkeleton } from "./hub-card-skeleton";

export function SkeletonHubList() {
  return (
    <div className="@container h-full overflow-y-auto sm:p-6 p-4 space-y-6 bg-bg">
      <PageHeader
        icon={FolderLibraryIcon}
        title="Hubs"
        subTitle="Manage your hubs and content"
        className={{
          container: "p-0! border-none",
        }}
      />

      <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <HubCardSkeleton key={`hub-skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
}
