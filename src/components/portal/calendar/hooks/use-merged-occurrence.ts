import { useCalendarStore } from "@/providers/calendar-store-provider";
import { mergeEventAndOccurrence } from "@/stores/calendar-store";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { MergedOccurrence } from "../calendar.types";
import { DEFAULT_EVENT_COLOR, getCurrentTimezone } from "../utils";

// Create a stable default for draft occurrences
const DRAFT_DEFAULTS = {
  timezone: getCurrentTimezone().id,
  userId: "-1",
  title: "Untitled",
  color: DEFAULT_EVENT_COLOR,
  description: null,
  hubId: null,
  price: null,
  recurrenceRule: null,
  isRecurring: null,
} satisfies Partial<MergedOccurrence>;

export const useMergedOccurrence = ({
  occurrenceId,
}: { occurrenceId?: number }): MergedOccurrence | null => {
  const occurrence = useCalendarStore(
    useShallow((store) =>
      occurrenceId ? store.occurrences.get(occurrenceId) : undefined,
    ),
  );

  const event = useCalendarStore(
    useShallow((store) =>
      occurrence ? store.events.get(occurrence.eventId) : undefined,
    ),
  );

  if (!occurrence) return null;

  return useMemo(() => {
    if (!occurrence) return null;

    // Handle draft occurrence with memoized defaults
    if (occurrence.id === -1) {
      return Object.freeze({
        ...occurrence,
        ...DRAFT_DEFAULTS,
        occurrenceId: occurrence.id,
      });
    }

    return event ? mergeEventAndOccurrence({ event, occurrence }) : null;
  }, [occurrence, event]); // Only recompute when these change
};
