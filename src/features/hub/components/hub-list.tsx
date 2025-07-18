"use client";

import { Button, buttonStyles } from "@/shared/components/ui/button";
import { Menu } from "@/shared/components/ui/menu";
import { SearchField } from "@/shared/components/ui/search-field";
import { cn } from "@/shared/lib/classes";
import { Heading } from "@/ui/heading";
import {
  FolderAddIcon,
  FolderLibraryIcon,
  FolderSearchIcon,
} from "@hugeicons-pro/core-solid-rounded";
import {
  Calendar01Icon,
  SortByUp02Icon,
  SortingAZ02Icon,
  SortingZA01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-aria-components";
import { getHubsByUserIdQueryOptions } from "../lib/hub-query-options";
import type { Hub } from "../types/hub.types";
import { HubCard } from "./hub-card";
import { HubCardSkeleton } from "./hub-card-skeleton";

type SortOption = {
  key: keyof Hub | "name-desc";
  label: string;
  icon: any;
};

export function HubList() {
  const { data: hubs, isLoading } = useQuery(getHubsByUserIdQueryOptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption["key"]>("name");

  const sortOptions: SortOption[] = [
    { key: "name", label: "Name (A-Z)", icon: SortingAZ02Icon },
    { key: "name-desc", label: "Name (Z-A)", icon: SortingZA01Icon },
    { key: "startDate", label: "Start Date", icon: Calendar01Icon },
    { key: "endDate", label: "End Date", icon: Calendar01Icon },
  ];

  const filteredAndSortedHubs = useMemo(() => {
    console.log("hubs", hubs);
    if (!hubs) return [];

    // Filter hubs based on search query
    const filtered = hubs?.filter(
      (hub) =>
        hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (hub.description?.toLowerCase() ?? "").includes(
          searchQuery.toLowerCase(),
        ),
    );

    // Sort based on selected option
    return [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      if (sortBy === "startDate") {
        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      }

      if (sortBy === "endDate") {
        // Handle null endDates by placing them at the end
        if (!a.endDate) return 1;
        if (!b.endDate) return -1;
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      }

      return 0;
    });
  }, [hubs, searchQuery, sortBy]);

  const handleSortChange = useCallback((key: SortOption["key"]) => {
    setSortBy(key);
  }, []);

  return (
    <>
      <div className="@container h-full overflow-y-auto p-5 space-y-6 bg-bg">
        <div className="flex flex-col @2xl:flex-row justify-between gap-4 items-start @2xl:items-center">
          <div className="flex items-center gap-x-4">
            <div className="size-12 rounded-lg bg-overlay shadow-md flex items-center justify-center">
              <HugeiconsIcon
                icon={FolderLibraryIcon}
                size={24}
                className="text-primary"
              />
            </div>
            <div className="flex flex-col">
              <Heading level={1}>Hubs</Heading>
              <span className="text-muted-fg text-sm">
                Manage your hubs and content
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center justify-end w-full @2xl:w-auto">
            <SearchField
              placeholder="Search hubs..."
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
              className={{
                primitive: "flex-1 @2xl:flex-none",
                fieldGroup: "bg-overlay",
              }}
            />

            <Menu>
              <Button
                intent="outline"
                size="small"
                shape="square"
                className="px-0 size-10 @2xl:h-10 @2xl:w-auto @2xl:px-4 bg-overlay"
                aria-label="Sort hubs"
              >
                <HugeiconsIcon icon={SortByUp02Icon} size={16} />
                <span className="hidden @2xl:block">Sort by</span>
              </Button>

              <Menu.Content
                selectionMode="single"
                selectedKeys={sortBy}
                items={sortOptions}
                placement="bottom end"
              >
                {(option) => (
                  <Menu.Item
                    key={option.key}
                    onAction={() => handleSortChange(option.key)}
                    id={option.key}
                    textValue={option.label}
                    className="flex items-center justify-between gap-2"
                  >
                    <HugeiconsIcon
                      icon={option.icon}
                      size={18}
                      className="text-muted-fg"
                    />
                    <Menu.Label className="flex-1">{option.label}</Menu.Label>

                    {sortBy === option.key && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                  </Menu.Item>
                )}
              </Menu.Content>
            </Menu>

            <Link
              className={cn(
                buttonStyles({
                  intent: "primary",
                  size: "small",
                  shape: "square",
                }),
                "px-0 size-10 @2xl:h-10 @2xl:w-auto @2xl:px-4",
              )}
              href="/portal/hubs/new"
            >
              <HugeiconsIcon icon={FolderAddIcon} size={16} />
              <span className="hidden @2xl:block">New Hub</span>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <HubCardSkeleton key={`hub-skeleton-${i}`} />
            ))}
          </div>
        ) : filteredAndSortedHubs?.length === 0 ? (
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
            <Link
              className={cn(
                buttonStyles({
                  intent: "primary",
                  size: "small",
                  shape: "square",
                }),
              )}
              href="/portal/hubs/new"
            >
              {searchQuery ? "Create New Hub" : "Create Your First Hub"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3 gap-4">
            {filteredAndSortedHubs?.map((hub) => (
              <HubCard key={hub.id} hub={hub} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
