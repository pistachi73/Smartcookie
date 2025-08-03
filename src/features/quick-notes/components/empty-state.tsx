import { HugeiconsIcon } from "@hugeicons/react";
import { NoteAddIcon } from "@hugeicons-pro/core-solid-rounded";
import * as m from "motion/react-m";
import { memo } from "react";

const EmptyStateComponent = () => {
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center w-full h-full p-6"
    >
      <div className="w-16 h-16 mb-4 text-primary/60">
        <HugeiconsIcon icon={NoteAddIcon} size={64} />
      </div>
      <h3 className="text-lg font-medium text-primary mb-1">
        No notes to display
      </h3>
      <p className="text-muted-fg text-center max-w-xs">
        Select a hub from the sidebar to view your notes or create new ones.
      </p>
    </m.div>
  );
};

export const EmptyState = memo(EmptyStateComponent);
