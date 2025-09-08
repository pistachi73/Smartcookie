import { NoteAddIcon } from "@hugeicons-pro/core-solid-rounded";
import * as m from "motion/react-m";

import { EmptyState } from "@/shared/components/ui/empty-state";

export const QuickNotesEmptyState = () => {
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center w-full h-full p-6 bg-white"
    >
      <EmptyState
        icon={NoteAddIcon}
        title="No notes to display"
        description="Select a hub from the sidebar to view your notes or create new ones."
      />
    </m.div>
  );
};
