"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons-pro/core-solid-rounded";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { SearchField } from "@/ui/search-field";
import { cn } from "@/shared/lib/classes";

import type { CustomColor } from "@/db/schema/shared";
import { useQuickNotesStore } from "@/features/quick-notes/store/quick-notes-store-provider";
import { quickNotesHubsQueryOptions } from "../../lib/quick-notes-query-options";
import { HubToggle } from "./hub-toggle";

export const QuickNotesSidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const { data: hubs } = useQuery(quickNotesHubsQueryOptions);

  const { visibleHubs, allHubsVisible, toggleHub, toggleAllHubsVisibility } =
    useQuickNotesStore(
      useShallow((state) => {
        const visibleHubs = state.visibleHubs;
        const allHubsVisible = hubs?.length === visibleHubs.size;
        return {
          visibleHubs,
          allHubsVisible,
          toggleHub: state.toggleHubVisibility,
          toggleAllHubsVisibility: state.toggleAllHubsVisibility,
        };
      }),
    );

  console.log("visibleHubs", visibleHubs, visibleHubs.size, hubs?.length);

  const handleToggleAllHubs = () => {
    if (!hubs) return;
    const allHubIds = hubs.map((hub) => hub.id);
    toggleAllHubsVisibility(allHubIds);
  };

  const filteredData = hubs
    ? hubs.filter(({ name }) =>
        name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  return (
    <div
      className={cn(
        "border-r h-full overflow-hidden min-h-0 flex flex-col shrink-0 bg-bg",
        isMinimized ? "w-auto" : "w-[300px]",
      )}
    >
      {!isMinimized && (
        <div className="p-4 pb-0 mb-2">
          <SearchField
            placeholder="Search hubs..."
            className={{ input: "text-sm", fieldGroup: "bg-overlay" }}
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
          />
        </div>
      )}

      <div className="p-4 pt-2 w-full h-full overflow-y-auto">
        <HubToggle
          label={allHubsVisible ? "Hide All Hubs" : "Show All Hubs"}
          icon={allHubsVisible ? ViewOffSlashIcon : ViewIcon}
          isVisible={allHubsVisible}
          isMinimized={isMinimized}
          onPress={() => {
            console.log("toggle all hubs");
            handleToggleAllHubs();
          }}
          prefix={
            <HugeiconsIcon
              icon={ViewIcon}
              altIcon={ViewOffSlashIcon}
              showAlt={allHubsVisible}
              size={16}
            />
          }
        />

        <div className="flex flex-col gap-y-2 mt-8">
          {filteredData?.map((hub) => (
            <HubToggle
              key={hub.id}
              label={hub.name}
              isVisible={visibleHubs.has(hub.id)}
              isMinimized={isMinimized}
              onPress={() => toggleHub(hub.id)}
              color={hub.color as CustomColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
