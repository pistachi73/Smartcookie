"use client";

import { Button } from "@/shared/components/ui/button";
import { SearchField } from "@/shared/components/ui/search-field";
import { Heading } from "@/ui/heading";
import {
  FolderAddIcon,
  FolderSearchIcon,
} from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { useHubs } from "../hooks/use-hubs";
import { HubCard } from "./hub-card";
import { HubCardSkeleton } from "./hub-card-skeleton";

const CreateHubModal = dynamic(
  () => import("./create-hub-modal").then((mod) => mod.CreateHubModal),
  {
    ssr: false,
    loading: () => null,
  },
);

export function HubList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: hubs, isLoading } = useHubs();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHubs = hubs?.filter(
    (hub) =>
      hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hub.description?.toLowerCase() ?? "").includes(
        searchQuery.toLowerCase(),
      ),
  );

  const handleOpenCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  return (
    <>
      <div className="@container bg-overlay h-full overflow-y-auto p-5 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <Heading level={1}>Manage hubs</Heading>
          <div className="flex gap-4 items-center">
            <SearchField
              placeholder="Search hubs..."
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
            />
            <Button
              intent="primary"
              size="small"
              shape="square"
              onPress={handleOpenCreateModal}
            >
              <HugeiconsIcon icon={FolderAddIcon} size={16} />
              New Hub
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <HubCardSkeleton key={`hub-skeleton-${i}`} />
            ))}
          </div>
        ) : filteredHubs?.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full p-6 mt-10">
            <div className="mb-4 text-primary">
              <HugeiconsIcon
                icon={FolderSearchIcon}
                altIcon={FolderSearchIcon}
                showAlt={!!searchQuery}
                size={48}
              />
            </div>
            <Heading level={2}>
              {searchQuery ? "No matching hubs found" : "No hubs yet"}
            </Heading>
            <p className="text-muted-fg text-base text-center max-w-xs mb-4">
              {searchQuery
                ? "Try adjusting your search query or create a new hub."
                : "Create your first hub to start organizing your content."}
            </p>
            <Button
              intent="primary"
              size="small"
              shape="square"
              onPress={handleOpenCreateModal}
            >
              {searchQuery ? "Create New Hub" : "Create Your First Hub"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 gap-4">
            {filteredHubs?.map((hub) => (
              <HubCard key={hub.id} hub={hub} />
            ))}
          </div>
        )}
      </div>

      <CreateHubModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        // onCreateHub={handleCreateHub}
      />
    </>
  );
}
