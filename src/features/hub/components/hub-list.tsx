"use client";

import type { Hub } from "@/db/schema";
import { Button } from "@/shared/components/ui/button";
import { SearchField } from "@/shared/components/ui/search-field";
import { Heading } from "@/ui/heading";
import { FolderAddIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useHubs } from "../hooks/use-hubs";
import { HubCard } from "./hub-card";

export function HubList() {
  const { data: hubs } = useHubs();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSelectHub = useCallback(
    (hub: Hub) => {
      router.push(`/portal/hubs/${hub.id}`);
    },
    [router],
  );

  const filteredHubs = hubs?.filter(
    (hub) =>
      hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 bg-overlay h-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center p-6">
        <Heading level={2}>Manage hubs</Heading>
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
            //  onPress={onCreateHub}
          >
            <HugeiconsIcon icon={FolderAddIcon} size={16} data-slot="icon" />
          </Button>
        </div>
      </div>

      {filteredHubs?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No hubs found</p>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search query
            </p>
          )}
          {!searchQuery && hubs?.length === 0 && (
            <div className="mt-4">
              <Button
                intent="primary"
                size="small"
                //   onPress={onCreateHub}
              >
                Create Your First Hub
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredHubs?.map((hub, index) => (
            <HubCard key={hub.id} hub={hub} onSelect={handleSelectHub} />
          ))}
        </div>
      )}
    </div>
  );
}
