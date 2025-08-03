import type { Temporal } from "temporal-polyfill";

import { useDragToCreateSession } from "@/features/calendar/hooks/use-drag-to-create-session";
import { DraftSession } from "../../pre-draft-event";

export const DragToCreateSession = ({ date }: { date: Temporal.PlainDate }) => {
  const { ref, dragStartY, dragEndY, handleMouseDown } = useDragToCreateSession(
    {
      date,
    },
  );

  return (
    <>
      <button
        ref={ref}
        className="absolute top-0 left-0 h-full w-full bg-transparent border-none p-0 cursor-default"
        onMouseDown={handleMouseDown}
        aria-label="Drag to create new event"
        type="button"
        tabIndex={-1}
      />
      {dragStartY !== null && dragEndY !== null && (
        <DraftSession startIndex={dragStartY} endIndex={dragEndY} />
      )}
    </>
  );
};
