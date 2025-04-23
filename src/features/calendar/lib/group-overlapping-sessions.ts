import type {
  CalendarSession,
  LayoutCalendarSession,
  TimeBoundary,
} from "@/features/calendar/types/calendar.types";
import Heap from "heap-js";
import memoize from "lodash/memoize";

export const groupOverlappingSessions = memoize(
  (sessions: CalendarSession[]): LayoutCalendarSession[] => {
    console.log("groupOverlappingSessions sessions", sessions);
    if (sessions.length === 0) {
      return [];
    }

    const timeBoundaries: TimeBoundary[] = sessions.flatMap((session) => [
      {
        time: new Date(session.startTime).getTime(),
        type: "start",
        sessionId: session.id,
      },
      {
        time: new Date(session.endTime).getTime(),
        type: "end",
        sessionId: session.id,
      },
    ]);

    timeBoundaries.sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time;
      return a.type === "end" ? -1 : 1; // 'end' comes before 'start' if times are equal
    });

    const sessionsMap = new Map<number, CalendarSession>(
      sessions.map((session) => [session.id, session]),
    );
    const groups: LayoutCalendarSession[][] = [];
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
    let currentGroup: LayoutCalendarSession[] = [];

    timeBoundaries.forEach((timeBoundary) => {
      const session = sessionsMap.get(timeBoundary.sessionId);
      if (!session) return;

      if (timeBoundary.type === "start") {
        activeEvents.add(session.id);

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
          endTime: new Date(session.endTime).getTime(),
          columnIndex: assignedColumn,
        });

        currentGroup.push({
          ...session,
          columnIndex: assignedColumn,
          totalColumns: maxColumns,
        });
      } else {
        activeEvents.delete(session.id);
      }

      // If no active events, push the current group and reset
      if (activeEvents.size === 0) {
        // Set totalColumns for the group
        const totalCols = maxColumns;
        currentGroup.forEach((session) => {
          session.totalColumns = totalCols;
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
  (sessions: CalendarSession[]) => {
    return sessions
      .map((s) => s.id)
      .sort((a, b) => a - b)
      .join(",");
  },
);
