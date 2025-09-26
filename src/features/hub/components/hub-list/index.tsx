"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  FolderLibraryIcon,
  FolderSearchIcon,
} from "@hugeicons-pro/core-solid-rounded";
import {
  Calendar01Icon,
  FolderAddIcon,
  InformationCircleIcon,
  SortByUp02Icon,
  SortingAZ02Icon,
  SortingZA01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Menu } from "@/shared/components/ui/menu";
import { SearchField } from "@/shared/components/ui/search-field";
import { Tooltip } from "@/shared/components/ui/tooltip";
import { Heading } from "@/ui/heading";
import { PageHeader } from "@/shared/components/layout/page-header";

import { getHubsByUserIdQueryOptions } from "../../lib/hub-query-options";
import type { Hub } from "../../types/hub.types";
import { HubCard } from "../hub-card";
import { UpgradePlanButton } from "../upgrade-plan-button";
import { NewHubButton } from "./new-hub-button";

type SortOption = {
  key: keyof Hub | "name-desc";
  label: string;
  icon: any;
};

export function HubList() {
  const { data: hubs } = useSuspenseQuery(getHubsByUserIdQueryOptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption["key"]>("lastActivityAt");

  const sortOptions: SortOption[] = [
    { key: "lastActivityAt", label: "Last Activity", icon: Calendar01Icon },
    { key: "name", label: "Name (A-Z)", icon: SortingAZ02Icon },
    { key: "name-desc", label: "Name (Z-A)", icon: SortingZA01Icon },
    { key: "startDate", label: "Start Date", icon: Calendar01Icon },
    { key: "endDate", label: "End Date", icon: Calendar01Icon },
  ];

  const filteredAndSortedHubs = useMemo(() => {
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
      if (sortBy === "lastActivityAt") {
        return (
          new Date(b.lastActivityAt).getTime() -
          new Date(a.lastActivityAt).getTime()
        );
      }

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

  const archivedHubs = useMemo(() => {
    return filteredAndSortedHubs?.filter((hub) => hub.status === "inactive");
  }, [filteredAndSortedHubs]);
  const activeHubs = useMemo(() => {
    return filteredAndSortedHubs?.filter((hub) => hub.status === "active");
  }, [filteredAndSortedHubs]);

  return (
    <div className="@container h-full overflow-y-auto p-4 sm:p-6 space-y-6 bg-bg">
      <div className="flex flex-col @2xl:flex-row justify-between gap-4 items-start @2xl:items-center">
        <PageHeader
          icon={FolderLibraryIcon}
          title="Courses"
          subTitle="Manage your courses and content"
          className={{
            container: "p-0! border-none",
          }}
        />

        <div className="flex gap-2 items-center justify-end w-full @2xl:w-auto">
          <SearchField
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            className={{
              primitive: "flex-1 @2xl:flex-none",
              fieldGroup: "bg-overlay h-10",
            }}
          />

          <Menu>
            <Button
              intent="outline"
              size="sm"
              className="px-0 size-10 @2xl:h-10 @2xl:w-auto @2xl:px-4 bg-overlay"
              aria-label="Sort courses"
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

          <NewHubButton
            size="sm"
            className="px-0 size-10 @2xl:h-10 @2xl:w-auto @2xl:px-4"
          >
            <HugeiconsIcon icon={FolderAddIcon} size={16} />
            <span className="hidden @2xl:block">New course</span>
          </NewHubButton>
        </div>
      </div>

      {filteredAndSortedHubs?.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No matching courses found" : "No courses yet"}
          description={
            searchQuery
              ? "Try rewriting your search or creating a new course."
              : "Create your first course to start organizing your content."
          }
          icon={FolderSearchIcon}
          className="bg-white"
          action={
            <NewHubButton size="sm" intent="primary">
              <HugeiconsIcon icon={FolderAddIcon} size={16} />
              <span className="hidden @2xl:block">New course</span>
            </NewHubButton>
          }
        />
      ) : (
        <div className="space-y-8">
          {/* Active Hubs Section */}
          {activeHubs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heading level={2}>Active Hubs ({activeHubs.length})</Heading>
              </div>
              <div className="grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3 gap-4">
                {activeHubs.map((hub) => (
                  <HubCard key={hub.id} hub={hub} />
                ))}
              </div>
            </div>
          )}

          {/* Inactive Hubs Section */}
          {archivedHubs.length > 0 && (
            <div className="space-y-4">
              <div className="flex  flex-col @2xl:flex-row @2xl:items-end justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Heading level={2}>
                      Archived Courses ({archivedHubs.length})
                    </Heading>
                    <Tooltip delay={0} closeDelay={0}>
                      <Tooltip.Trigger>
                        <HugeiconsIcon
                          icon={InformationCircleIcon}
                          size={16}
                          className="text-muted-fg hover:text-fg transition-colors cursor-help"
                        />
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <div className="max-w-xs">
                          <p className="font-medium mb-1">
                            Why are courses archived?
                          </p>
                          <p className="text-sm">
                            Courses are automatically archived when you exceed
                            your plan's hub limit. Free and Basic plans allow up
                            to 2 active hubs. Upgrade to Premium for unlimited
                            hubs.
                          </p>
                        </div>
                      </Tooltip.Content>
                    </Tooltip>
                  </div>

                  <p className="text-sm text-muted-fg @2xl:text-balance">
                    These courses are in read-only mode. You can view content
                    but cannot make changes.
                  </p>
                </div>

                <UpgradePlanButton
                  intent="primary"
                  size="md"
                  className={"w-full shrink-0 @2xl:w-auto"}
                />
              </div>

              <div className="grid grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-3 gap-4">
                {archivedHubs.map((hub) => (
                  <HubCard key={hub.id} hub={hub} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
