"use client";

import { Button } from "@/components/ui";
import { useQuickNotesStore } from "@/providers/quick-notes-store-provider";
import { FilterHorizontalIcon } from "@hugeicons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { HubQuickNotes } from "./hub-quick-notes";
import { QuickNotesFilter } from "./quick-notes-filter";

import { quickNotesQueryOptions } from "./utils";

export const QuickNotes = () => {
  const { data } = useSuspenseQuery(quickNotesQueryOptions);
  const visibleHubs = useQuickNotesStore((state) => state.visibleHubs);
  const toggleFilterPanel = useQuickNotesStore((state) => state.toggleFilterPanel);

  // Filter data based on visibleHubs
  const filteredData = data?.filter(({ hub }) => visibleHubs.includes(hub.id));

  return (
    <>
      <div className='flex flex-col h-full bg-overlay rounded-xl gap-4 w-full'>
        <div className='flex items-center justify-between p-4 pb-0'>
          <h1 className='text-2xl font-bold'>Quick Notes</h1>
          <Button intent='secondary' size='small' onPress={toggleFilterPanel}>
            Filter <FilterHorizontalIcon size={16} />
          </Button>
        </div>
        <div className='flex flex-row gap-4 overflow-x-scroll h-full p-4 pt-0'>
          {filteredData?.map(({ hub, notes }) => (
            <HubQuickNotes key={hub.id} hub={hub} notes={notes} />
          ))}
        </div>
      </div>
      <QuickNotesFilter />
    </>
  );
};
