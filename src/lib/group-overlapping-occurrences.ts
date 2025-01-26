import { getEventOccurrenceDayKey } from "@/components/portal/calendar/utils";
import type {
  CalendarDraftEventOccurrence,
  CalendarEventOccurrence,
} from "@/stores/calendar-store";
import { TZDate, TZDateMini } from "@date-fns/tz";
import Heap from "heap-js";

export type GroupProps = {
  columnIndex: number;
  totalColumns: number;
};

export type GroupedCalendarOccurrence = CalendarEventOccurrence & GroupProps;
export type GroupedDraftCalendarOccurrence = CalendarDraftEventOccurrence &
  GroupProps;

export type GroupedOccurrence =
  | GroupedCalendarOccurrence
  | GroupedDraftCalendarOccurrence;

interface TimePoint {
  time: number; // Using timestamp for efficiency
  type: "start" | "end";
  event: GroupedOccurrence;
}

export const sweepLineGroupOverlappingOccurrences = (
  eventOccurrences: (CalendarEventOccurrence | CalendarDraftEventOccurrence)[],
): GroupedOccurrence[] => {
  if (eventOccurrences.length === 0) {
    return [];
  }

  // Create time points for all start and end times
  const times: TimePoint[] = eventOccurrences.flatMap((event) => [
    {
      time: event.startTime.getTime(),
      type: "start",
      event: { ...event, columnIndex: 0, totalColumns: 0 },
    },
    {
      time: event.endTime.getTime(),
      type: "end",
      event: {
        ...event,
        columnIndex: 0,
        totalColumns: 0,
      },
    },
  ]);

  times.sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time;
    return a.type === "end" ? -1 : 1; // 'end' comes before 'start' if times are equal
  });

  const groups: GroupedOccurrence[][] = [];
  const activeEvents: Set<number> = new Set();

  // Heap to keep track of active columns sorted by endTime
  const activeColumnsHeap = new Heap<{ endTime: number; columnIndex: number }>(
    (a, b) => {
      if (a.endTime !== b.endTime) {
        return a.endTime - b.endTime;
      }
      return a.columnIndex - b.columnIndex;
    },
  );

  // Heap to keep track of available columns sorted by columnIndex
  const availableColumnsHeap = new Heap<number>((a, b) => a - b);

  let maxColumns = 0;
  let currentGroup: GroupedOccurrence[] = [];

  times.forEach((point) => {
    const event = point.event;

    if (point.type === "start") {
      activeEvents.add(event.eventOccurrenceId);

      // Release all columns that have ended before the current event's start time
      while (
        !activeColumnsHeap.isEmpty() &&
        activeColumnsHeap.peek()!.endTime <= point.time
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

      // Assign columnIndex and push to activeColumnsHeap
      event.columnIndex = assignedColumn;
      activeColumnsHeap.push({
        endTime: event.endTime.getTime(),
        columnIndex: assignedColumn,
      });

      // Add to current group with start and end times adjusted to the timezone
      currentGroup.push({
        ...event,
        startTime: new Date(new TZDateMini(event.startTime, event.timezone)),
        endTime: new Date(new TZDate(event.endTime, event.timezone)),
      });
    } else {
      activeEvents.delete(event.eventOccurrenceId);
      // Note: The column is already released in the "start" event processing
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
};
export type DayGroupedEventOccurrences = Record<string, GroupedOccurrence[]>;

export const groupEventOccurrencesByDayAndTime = (
  eventOccurrences: CalendarEventOccurrence[],
) => {
  const eventOccurrencesByDay = eventOccurrences.reduce<
    Record<string, CalendarEventOccurrence[]>
  >((ocurrencesByDay, occurrence) => {
    const dayKey = getEventOccurrenceDayKey(occurrence.startTime);

    if (!ocurrencesByDay[dayKey]) {
      ocurrencesByDay[dayKey] = [];
    }
    ocurrencesByDay[dayKey].push(occurrence);
    return ocurrencesByDay;
  }, {});

  const groupedEventOccurrences: DayGroupedEventOccurrences = {};

  Object.entries(eventOccurrencesByDay).forEach(
    ([day, dayEventOccurrences]) => {
      groupedEventOccurrences[day] =
        sweepLineGroupOverlappingOccurrences(dayEventOccurrences);
    },
  );

  return groupedEventOccurrences;
};
