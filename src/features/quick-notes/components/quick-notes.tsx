"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon, NoteIcon } from "@hugeicons-pro/core-solid-rounded";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { PageHeader } from "@/shared/components/layout/page-header";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";

import { HubStackList } from "./hub-stack-list";
import { QuickNotesSidebar } from "./quick-notes-sidebar";

export const QuickNotes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { down } = useViewport();

  return (
    <div className="min-h-0 h-full flex flex-col">
      <PageHeader
        title="Quick Notes"
        icon={NoteIcon}
        className={{
          actionsContainer: "flex-row items-center",
          container: "bg-bg flex-row items-center",
        }}
        actions={
          down("lg") ? (
            <Button
              onPress={() => setIsSidebarOpen(true)}
              intent="secondary"
              size="sm"
            >
              <span className="hidden @2xl:block">Filter by courses</span>
              <HugeiconsIcon
                icon={FilterIcon}
                size={16}
                data-slot="icon"
                className="block @2xl:hidden"
              />
            </Button>
          ) : undefined
        }
      />
      <div className="flex flex-1 h-full min-h-0 ">
        <QuickNotesSidebar
          isOpen={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
        />
        <HubStackList />
      </div>
    </div>
  );
};
