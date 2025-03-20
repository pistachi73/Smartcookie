import type { Occurrence } from "@/db/schema";
import type {
  LayoutOccurrence,
  TimeBoundary,
} from "@/features/calendar/types/calendar.types";
import Heap from "heap-js";
import memoize from "lodash/memoize";

export const groupOverlappingOccurrences = memoize(
  (occurrences: Occurrence[]): LayoutOccurrence[] => {
    if (occurrences.length === 0) {
      return [];
    }

    const timeBoundaries: TimeBoundary[] = occurrences.flatMap((occurrence) => [
      {
        time: new Date(occurrence.startTime).getTime(),
        type: "start",
        occurrenceId: occurrence.id,
      },
      {
        time: new Date(occurrence.endTime).getTime(),
        type: "end",
        occurrenceId: occurrence.id,
      },
    ]);

    timeBoundaries.sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time;
      return a.type === "end" ? -1 : 1; // 'end' comes before 'start' if times are equal
    });

    const occurrencesMap = new Map<number, Occurrence>(
      occurrences.map((occurrence) => [occurrence.id, occurrence]),
    );
    const groups: LayoutOccurrence[][] = [];
    const activeEvents: Set<number> = new Set();

    // Heap to keep track of active columns sorted by endTime
    const activeColumnsHeap = new Heap<{
      endTime: number;
      columnIndex: number;
    }>((a, b) => {
      if (a.endTime !== b.endTime) {
        return a.endTime - b.endTime;
      }
      return a.columnIndex - b.columnIndex;
    });

    // Heap to keep track of available columns sorted by columnIndex
    const availableColumnsHeap = new Heap<number>((a, b) => a - b);

    let maxColumns = 0;
    let currentGroup: LayoutOccurrence[] = [];

    timeBoundaries.forEach((timeBoundary) => {
      const occurrence = occurrencesMap.get(timeBoundary.occurrenceId);
      if (!occurrence) return;

      if (timeBoundary.type === "start") {
        activeEvents.add(occurrence.id);

        // Release all columns that have ended before the current event's start time
        while (
          !activeColumnsHeap.isEmpty() &&
          activeColumnsHeap.peek()!.endTime <= timeBoundary.time
        ) {
          const freedColumn = activeColumnsHeap.pop()!.columnIndex;
          availableColumnsHeap.push(freedColumn);
        }

        // Assign a column
        let assignedColumn: number;
        if (!availableColumnsHeap.isEmpty()) {
          assignedColumn = availableColumnsHeap.pop()!;
        } else {
          assignedColumn = maxColumns;
          maxColumns += 1;
        }

        activeColumnsHeap.push({
          endTime: new Date(occurrence.endTime).getTime(),
          columnIndex: assignedColumn,
        });

        currentGroup.push({
          occurrenceId: occurrence.id,
          columnIndex: assignedColumn,
          totalColumns: maxColumns,
        });
      } else {
        activeEvents.delete(occurrence.id);
      }

      // If no active events, push the current group and reset
      if (activeEvents.size === 0) {
        // Set totalColumns for the group
        const totalCols = maxColumns;
        currentGroup.forEach((occ) => {
          occ.totalColumns = totalCols;
        });
        // Clear the heaps for the next group
        activeColumnsHeap.removeAll();
        availableColumnsHeap.removeAll();
        groups.push(currentGroup);
        currentGroup = [];
        maxColumns = 0;
      }
    });

    return groups.flat();
  },
  // Custom resolver function that creates a cache key based on occurrence IDs
  (occurrences: Occurrence[]) => {
    return occurrences
      .map((o) => o.id)
      .sort((a, b) => a - b)
      .join(",");
  },
);
