import type { Temporal } from "temporal-polyfill";
import { PreDraftEvent } from "../../pre-draft-event";

import { useDragToCreateEvent } from "@/features/calendar/hooks/use-drag-to-create-event";

export const DragToCreateEvent = ({ date }: { date: Temporal.PlainDate }) => {
  const { ref, dragStartY, dragEndY, handleMouseDown } = useDragToCreateEvent({
    date,
  });
  return (
    <>
      <div
        ref={ref}
        className="absolute top-0 left-0 h-full w-full"
        onMouseDown={handleMouseDown}
      />
      {dragStartY !== null && dragEndY !== null && (
        <PreDraftEvent startIndex={dragStartY} endIndex={dragEndY} />
      )}
    </>
  );
};
