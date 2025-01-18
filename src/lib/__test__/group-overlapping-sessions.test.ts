// sweepLineGroupOverlappingOccurrences.test.ts

import { sweepLineGroupOverlappingOccurrences } from "../group-overlapping-occurrences";

describe("sweepLineGroupOverlappingOccurrences", () => {
  it("should group non-overlapping events into the same group", () => {
    const events = [
      {
        eventOccurrenceId: 1,
        startTime: new Date("2023-10-10T09:00:00Z"),
        endTime: new Date("2023-10-10T10:00:00Z"),
      },
      {
        eventOccurrenceId: 2,
        startTime: new Date("2023-10-10T10:00:00Z"),
        endTime: new Date("2023-10-10T11:00:00Z"),
      },
      {
        eventOccurrenceId: 3,
        startTime: new Date("2023-10-10T11:00:00Z"),
        endTime: new Date("2023-10-10T12:00:00Z"),
      },
    ];

    const grouped = sweepLineGroupOverlappingOccurrences(events as any);
    expect(grouped.length).toBe(1);
    expect(grouped[0]?.length).toBe(3);
  });

  it("should correctly separate overlapping events into different groups", () => {
    const events = [
      {
        eventOccurrenceId: 1,
        startTime: new Date("2023-10-10T09:00:00Z"),
        endTime: new Date("2023-10-10T10:00:00Z"),
      },
      {
        eventOccurrenceId: 2,
        startTime: new Date("2023-10-10T09:30:00Z"),
        endTime: new Date("2023-10-10T10:30:00Z"),
      },
      {
        eventOccurrenceId: 3,
        startTime: new Date("2023-10-10T10:00:00Z"),
        endTime: new Date("2023-10-10T11:00:00Z"),
      },
    ];

    const grouped = sweepLineGroupOverlappingOccurrences(events as any);
    expect(grouped.length).toBe(2);
    expect(grouped[0]?.length).toBe(2); // Events 1 and 3
    expect(grouped[1]?.length).toBe(1); // Event 2
  });

  it("should handle events with identical start and end times by placing them in separate groups", () => {
    const events = [
      {
        eventOccurrenceId: 1,
        startTime: new Date("2023-10-10T09:00:00Z"),
        endTime: new Date("2023-10-10T10:00:00Z"),
      },
      {
        eventOccurrenceId: 2,
        startTime: new Date("2023-10-10T09:00:00Z"),
        endTime: new Date("2023-10-10T10:00:00Z"),
      },
      {
        eventOccurrenceId: 3,
        startTime: new Date("2023-10-10T09:00:00Z"),
        endTime: new Date("2023-10-10T10:00:00Z"),
      },
    ];

    const grouped = sweepLineGroupOverlappingOccurrences(events as any);
    expect(grouped.length).toBe(3);
    expect(grouped[0]?.length).toBe(1);
    expect(grouped[1]?.length).toBe(1);
    expect(grouped[2]?.length).toBe(1);
  });

  it("should handle a mixture of overlapping and non-overlapping events", () => {
    const events = [
      {
        eventOccurrenceId: 1,
        startTime: new Date("2023-10-10T08:00:00Z"),
        endTime: new Date("2023-10-10T09:00:00Z"),
      },
      {
        eventOccurrenceId: 2,
        startTime: new Date("2023-10-10T08:30:00Z"),
        endTime: new Date("2023-10-10T09:30:00Z"),
      },
      {
        eventOccurrenceId: 3,
        startTime: new Date("2023-10-10T09:15:00Z"),
        endTime: new Date("2023-10-10T10:15:00Z"),
      },
      {
        eventOccurrenceId: 4,
        startTime: new Date("2023-10-10T10:00:00Z"),
        endTime: new Date("2023-10-10T11:00:00Z"),
      },
      {
        eventOccurrenceId: 5,
        startTime: new Date("2023-10-10T11:30:00Z"),
        endTime: new Date("2023-10-10T12:30:00Z"),
      },
    ];

    const grouped = sweepLineGroupOverlappingOccurrences(events as any);
    expect(grouped.length).toBe(3);
    expect(grouped[0]?.length).toBe(2); // Events 1 and 3
    expect(grouped[1]?.length).toBe(1); // Event 2
    expect(grouped[2]?.length).toBe(2); // Events 4 and 5
  });
});
