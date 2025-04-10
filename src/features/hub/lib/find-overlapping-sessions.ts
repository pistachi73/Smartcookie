/**
 * Finds overlapping intervals in an array of time ranges using a sweep line algorithm
 * @param intervals Array of [startTime, endTime] pairs
 * @returns Array of pairs of overlapping intervals indices, empty if no overlaps
 */
export function findOverlappingIntervals(
  intervals: [number, number][],
): [number, number][] {
  if (intervals.length <= 1) {
    return [];
  }

  // Create event points for sweep line algorithm
  const events: Array<{ time: number; isStart: boolean; index: number }> = [];

  intervals.forEach((interval, index) => {
    events.push({ time: interval[0], isStart: true, index });
    events.push({ time: interval[1], isStart: false, index });
  });

  // Sort events by time, with start events before end events if times are equal
  events.sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time;
    // If times are equal, end events come first (important for intervals that touch exactly)
    return a.isStart ? 1 : -1;
  });

  const overlaps: [number, number][] = [];
  const activeIntervals: number[] = [];

  // Process events in time order
  for (const event of events) {
    if (event.isStart) {
      // For each active interval when we start a new one, they overlap with the new one
      for (const activeIndex of activeIntervals) {
        overlaps.push([activeIndex, event.index]);
      }
      // Add current interval to active set
      activeIntervals.push(event.index);
    } else {
      // Remove interval from active set when we reach its end
      const index = activeIntervals.indexOf(event.index);
      if (index > -1) {
        activeIntervals.splice(index, 1);
      }
    }
  }

  return overlaps;
}

/**
 * Checks if any intervals in the array overlap
 * @param intervals Array of [startTime, endTime] pairs
 * @returns Boolean indicating whether any overlaps exist
 */
export function hasOverlappingIntervals(
  intervals: [number, number][],
): boolean {
  // For simple existence check, we can optimize further
  if (intervals.length <= 1) {
    return false;
  }

  // Create event points for start and end
  const events: Array<{ time: number; isStart: boolean }> = [];

  intervals.forEach((interval) => {
    events.push({ time: interval[0], isStart: true });
    events.push({ time: interval[1], isStart: false });
  });

  // Sort events by time
  events.sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time;
    return a.isStart ? 1 : -1;
  });

  let activeCount = 0;

  // Process events in time order
  for (const event of events) {
    if (event.isStart) {
      activeCount++;
      // If we have more than one active interval, we found an overlap
      if (activeCount > 1) {
        return true;
      }
    } else {
      activeCount--;
    }
  }

  return false;
}
