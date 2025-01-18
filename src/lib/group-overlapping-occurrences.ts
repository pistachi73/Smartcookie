import { getEventOccurrenceDayKey } from "@/components/portal/calendar/utils";
import type { EventOccurrence } from "@/db/schema";
import type { DraftEventOccurrence } from "@/stores/calendar-store";

export const sweepLineGroupOverlappingOccurrences = (
  eventOccurrences: (EventOccurrence | DraftEventOccurrence)[],
): (EventOccurrence | DraftEventOccurrence)[][] => {
  if (eventOccurrences.length === 0) {
    return [];
  }

  const times: {
    time: Date;
    type: "start" | "end";
    event: EventOccurrence | DraftEventOccurrence;
  }[] = [];

  eventOccurrences.forEach((event) => {
    times.push({ time: new Date(event.startTime), type: "start", event });
    times.push({ time: new Date(event.endTime), type: "end", event });
  });

  times.sort((a, b) => {
    const diff = a.time.getTime() - b.time.getTime();
    if (diff !== 0) return diff;
    return a.type === "start" ? 1 : -1;
  });

  const activeEvents: Set<EventOccurrence | DraftEventOccurrence> = new Set();
  const groups: (EventOccurrence | DraftEventOccurrence)[][] = [];
  const columnsEndTime: Date[] = []; // Tracks end time for each column

  times.forEach((point) => {
    if (point.type === "start") {
      let assignedColumn = columnsEndTime.findIndex(
        (endTime) => endTime <= point.time,
      );
      if (assignedColumn === -1) {
        // No available column, create a new one
        assignedColumn = columnsEndTime.length;
        columnsEndTime.push(point.time);
      } else {
        // Assign to this column and update the end time
        if (columnsEndTime.length) {
          columnsEndTime[assignedColumn] =
            point.time > columnsEndTime[assignedColumn]
              ? point.time
              : columnsEndTime[assignedColumn];
        }
      }
      activeEvents.add(point.event);
      if (activeEvents.size === 1) {
        groups.push([point.event]);
      } else {
        const currentGroup = groups[groups.length - 1];
        currentGroup!.push(point.event);
      }
    } else {
      activeEvents.delete(point.event);
    }
  });

  return groups;
};
export type DayGroupedEventOccurrences = Record<
  string,
  (EventOccurrence | DraftEventOccurrence)[][]
>;

export const groupEventOccurrencesByDayAndTime = (
  eventOccurrences: EventOccurrence[],
) => {
  const eventOccurrencesByDay = eventOccurrences.reduce<
    Record<string, (EventOccurrence | DraftEventOccurrence)[]>
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
