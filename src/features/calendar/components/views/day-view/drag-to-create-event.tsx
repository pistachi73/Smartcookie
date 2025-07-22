import type { Temporal } from "temporal-polyfill";

import { useDragToCreateEvent } from "@/features/calendar/hooks/use-drag-to-create-event";
import { PreDraftEvent } from "../../pre-draft-event";

export const DragToCreateEvent = ({ date }: { date: Temporal.PlainDate }) => {
  const { ref, dragStartY, dragEndY, handleMouseDown, handleTouchStart } =
    useDragToCreateEvent({
      date,
    });

  return (
    <>
      <div
        ref={ref}
        className="absolute top-0 left-0 h-full w-full cursor-crosshair touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="button"
        tabIndex={0}
        aria-label="Drag to create new event"
        // Make it focusable and handle keyboard interaction
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            // For keyboard users, we could trigger a default event creation
            // or show a time picker modal
          }
        }}
      />
      {dragStartY !== null && dragEndY !== null && (
        <PreDraftEvent startIndex={dragStartY} endIndex={dragEndY} />
      )}
    </>
  );
};
