"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { Heading } from "@/shared/components/ui/heading";
import { Sheet } from "@/shared/components/ui/sheet";
import { SearchField } from "@/ui/search-field";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { cn } from "@/shared/lib/classes";

import type { CustomColor } from "@/db/schema/shared";
import { useQuickNotesStore } from "@/features/quick-notes/store/quick-notes-store-provider";
import { quickNotesHubsQueryOptions } from "../../lib/quick-notes-query-options";
import { HubToggle } from "./hub-toggle";

type QuickNotesSidebarProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const QuickNotesSidebar = ({
  isOpen,
  onOpenChange,
}: QuickNotesSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { down } = useViewport();

  const isDownLg = down("lg");

  if (isDownLg) {
    return (
      <Sheet isOpen={isOpen} onOpenChange={onOpenChange}>
        <Sheet.Content side="right" className="w-[480px] max-w-[96vw]">
          <Sheet.Header title="Filter by course" />
          <Sheet.Body className="space-y-6">
            <SearchField
              placeholder="Search courses..."
              className={{ input: "text-sm", fieldGroup: "bg-overlay h-10" }}
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
            />
            <QuickNotesSidebarFilter searchQuery={searchQuery} />
          </Sheet.Body>
        </Sheet.Content>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "border-r h-full min-h-0 flex flex-col shrink-0  bg-muted w-[300px]",
      )}
    >
      <div className="p-4 pb-0 mb-2 space-y-2">
        <Heading level={3} className="mb-2">
          Filter by hubs
        </Heading>
        <SearchField
          placeholder="Search hubs..."
          className={{ input: "text-sm", fieldGroup: "bg-white h-10" }}
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
        />
      </div>

      <div className="p-4 overflow-y-auto">
        <QuickNotesSidebarFilter searchQuery={searchQuery} />
      </div>
    </div>
  );
};

const QuickNotesSidebarFilter = ({ searchQuery }: { searchQuery: string }) => {
  const { data: hubs } = useQuery(quickNotesHubsQueryOptions);

  const { visibleHubs, toggleHub, toggleAllHubsVisibility } =
    useQuickNotesStore(
      useShallow((state) => ({
        visibleHubs: state.visibleHubs,
        toggleHub: state.toggleHubVisibility,
        toggleAllHubsVisibility: state.toggleAllHubsVisibility,
      })),
    );

  const allHubsVisible = hubs?.length === visibleHubs.length;

  const filteredData = hubs
    ? hubs.filter(({ name }) =>
        name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const handleToggleAllHubs = () => {
    if (!hubs) return;
    const allHubIds = hubs.map((hub) => hub.id);
    toggleAllHubsVisibility(allHubIds);
  };

  return (
    <div className="space-y-2 overflow-y-auto">
      <HubToggle
        label={allHubsVisible ? "Hide All Courses" : "Show All Courses"}
        isVisible={allHubsVisible}
        onPress={handleToggleAllHubs}
        className="mb-4"
      />
      {filteredData?.map((hub) => (
        <HubToggle
          key={hub.id}
          label={hub.name}
          isViewOnlyMode={hub.status === "inactive"}
          isVisible={visibleHubs.includes(hub.id)}
          onPress={() => toggleHub(hub.id)}
          color={hub.color as CustomColor}
          prefix="dot"
        />
      ))}
    </div>
  );
};
