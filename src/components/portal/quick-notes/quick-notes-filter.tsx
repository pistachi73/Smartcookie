"use client";

import { Badge, Checkbox, CheckboxGroup, Label, SearchField, Sheet } from "@/components/ui";
import { useQuickNotesStore } from "@/providers/quick-notes-store-provider";
import { useState } from "react";

export const QuickNotesFilter = () => {
  const visibleHubs = useQuickNotesStore((state) => state.visibleHubs);
  const hubs = useQuickNotesStore((state) => state.hubs);
  const isFilterPanelOpen = useQuickNotesStore((state) => state.isFilterPanelOpen);
  const setFilterPanelOpen = useQuickNotesStore((state) => state.setFilterPanelOpen);
  const setVisibleHubs = useQuickNotesStore((state) => state.setVisibleHubs);

  const [selectedHubs, setSelectedHubs] = useState<string[]>(visibleHubs.map(String));
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHubs = hubs
    ? hubs.filter((hub) => hub.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleApplyFilter = () => {
    setVisibleHubs(selectedHubs.map(Number));
    setFilterPanelOpen(false);
  };

  const handleClose = () => {
    setFilterPanelOpen(false);
  };

  return (
    <Sheet.Content
      isOpen={isFilterPanelOpen}
      onOpenChange={handleClose}
      side='right'
      classNames={{ content: "w-[360px]!", overlay: "bg-transparent " }}
    >
      <Sheet.Header>
        <Sheet.Title level={1} className='gap-2 text-2xl'>
          Filter by hub
        </Sheet.Title>
        <Sheet.Description>Choose which hubs to display in Quick Notes.</Sheet.Description>
      </Sheet.Header>
      <Sheet.Body className='p-4!'>
        <SearchField
          className={"h-14 text-sm"}
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
        />

        <div>
          <Label className='font-bold text-foreground'>Hubs</Label>
          <div className='ml-2'>
            <CheckboxGroup
              className='space-y-3'
              value={visibleHubs.map(String)}
              onChange={(value) => {
                console.log(value);
                setVisibleHubs(value.map(Number));
              }}
            >
              {filteredHubs.length > 0 ? (
                filteredHubs.map((hub) => (
                  <Checkbox key={hub.id} value={hub.id.toString()}>
                    <Badge intent='secondary' shape='circle' className='text-base'>
                      {hub.name}
                    </Badge>
                  </Checkbox>
                ))
              ) : (
                <p className='text-sm text-muted-foreground'>No hubs found</p>
              )}
            </CheckboxGroup>
          </div>
        </div>
      </Sheet.Body>
    </Sheet.Content>
  );
};
