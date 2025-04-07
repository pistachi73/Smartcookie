"use client";

import type { CustomColor } from "@/db/schema/shared";
import { useQuickNotesStore } from "@/features/notes/store/quick-notes-store-provider";
import { cn } from "@/shared/lib/classes";
import { Button } from "@/ui/button";
import { Heading } from "@/ui/heading";
import { SearchField } from "@/ui/search-field";
import { Separator } from "@/ui/separator";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons-pro/core-solid-rounded";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { quickNotesHubsQueryOptions } from "../../lib/quick-notes-query-options";
import { HubToggle } from "./hub-toggle";

export const QuickNotesSidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const { data: hubs } = useQuery(quickNotesHubsQueryOptions);

  const { visibleHubs, allHubsVisible, toggleHub } = useQuickNotesStore(
    useShallow((state) => {
      const visibleHubs = state.visibleHubs;
      const allHubsVisible = hubs?.length === visibleHubs.size;
      return {
        visibleHubs,
        allHubsVisible,
        toggleHub: state.toggleHubVisibility,
      };
    }),
  );

  const toggleAllHubsVisibility = useQuickNotesStore(
    (state) => state.toggleAllHubsVisibility,
  );

  const filteredData = hubs
    ? hubs.filter(({ name }) =>
        name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  return (
    <div
      className={cn(
        "border-r h-full overflow-hidden min-h-0 flex flex-col shrink-0",
        isMinimized ? "w-auto" : "w-[300px]",
      )}
    >
      <div className={cn("flex items-center px-4  py-2 justify-between")}>
        {!isMinimized && (
          <Heading level={2} className="text-lg font-medium text-nowrap">
            Quick Notes
          </Heading>
        )}
        <Button
          size="square-petite"
          shape="square"
          appearance="plain"
          intent="secondary"
          onPress={() => setIsMinimized((isMinimized) => !isMinimized)}
          className="size-10"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            altIcon={ArrowRight01Icon}
            showAlt={isMinimized}
            size={16}
          />
        </Button>
      </div>

      <Separator orientation="horizontal" />

      {!isMinimized && (
        <div className="p-4 pb-0 mb-2">
          <SearchField
            placeholder="Search hubs..."
            className={{ input: "text-sm" }}
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
          />
        </div>
      )}

      <div className="p-4 pt-2 w-full h-full overflow-y-scroll">
        <HubToggle
          label={allHubsVisible ? "Hide All Hubs" : "Show All Hubs"}
          icon={allHubsVisible ? ViewOffSlashIcon : ViewIcon}
          isVisible={allHubsVisible}
          isMinimized={isMinimized}
          onPress={toggleAllHubsVisibility}
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
