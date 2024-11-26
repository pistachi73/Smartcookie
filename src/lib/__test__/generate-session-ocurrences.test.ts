import type { RecurrenceRule } from "@/db/schema";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  isSameDay,
  startOfMonth,
} from "date-fns";
import {
  generateSessionOccurrences,
  incrementDate,
} from "../generate-session-ocurrences";
import { mockDate, mockRecurrentSession } from "./__mock__";

describe("incrementDate", () => {
  it("should increment date by 3 day", () => {
    const date = new Date("2023-10-01");
    const incrementedDate = incrementDate(date, "daily", 3);
    expect(isSameDay(addDays(date, 3), incrementedDate)).toEqual(true);
  });
  it("should increment date by 1 week", () => {
    const date = new Date("2023-10-01");
    const incrementedDate = incrementDate(date, "weekly", 1);
    expect(isSameDay(addWeeks(date, 1), incrementedDate)).toEqual(true);
  });
  it("should increment date by 2 months", () => {
    const date = new Date("2023-10-01T00:00:00.000Z");
    const incrementedDate = incrementDate(date, "monthly", 2);
    expect(isSameDay(addMonths(date, 2), incrementedDate)).toEqual(true);
  });
});

describe("generateSessionOccurrences", () => {
  it("should generate session occurrences in one month", () => {
    const { frequency, interval } =
      mockRecurrentSession.recurrenceRule as RecurrenceRule;
    const sessionDuration =
      new Date(mockRecurrentSession.endTime).getTime() -
      new Date(mockRecurrentSession.startTime).getTime();

    const sessionOccurrences = generateSessionOccurrences({
      session: mockRecurrentSession,
      startDate: startOfMonth(mockDate),
      endDate: endOfMonth(mockDate),
    });

    expect(sessionOccurrences.length).toEqual(4);
    sessionOccurrences.forEach((occurrence, index) => {
      expect(
        isSameDay(
          occurrence.startTime,
          incrementDate(mockDate, frequency, interval * index),
        ),
      ).toEqual(true);
      expect(
        isSameDay(
          occurrence.endTime,
          incrementDate(
            new Date(mockDate.getTime() + sessionDuration),
            frequency,
            interval * index,
          ),
        ),
      ).toEqual(true);
    });
  });

  it("should generate session occurrences with exceptions", () => {
    const sessionOccurrences = generateSessionOccurrences({
      session: {
        ...mockRecurrentSession,
        exceptions: [
          {
            id: 1,
            sessionId: 1,
            exceptionDate: addWeeks(mockDate, 1),
            reason: "skip",
            comments: null,
            newEndTime: null,
            newStartTime: null,
          },
        ],
      },

      startDate: startOfMonth(mockDate),
      endDate: endOfMonth(mockDate),
    });
    expect(sessionOccurrences.length).toEqual(3);
  });

  it("should generate session occurrences with rescheduled exceptions", () => {
    const [rescheduleStartDate, rescheduleEndDate] = [
      addDays(mockDate, 8),
      addDays(mockDate, 8),
    ];

    const sessionOccurrences = generateSessionOccurrences({
      session: {
        ...mockRecurrentSession,
        exceptions: [
          {
            id: 1,
            sessionId: 1,
            exceptionDate: addWeeks(mockDate, 1),
            reason: "reschedule",
            comments: null,
            newStartTime: rescheduleStartDate,
            newEndTime: rescheduleEndDate,
          },
        ],
      },

      startDate: startOfMonth(mockDate),
      endDate: endOfMonth(mockDate),
    });

    expect(sessionOccurrences.length).toEqual(4);
    sessionOccurrences.forEach((occurrence) => {
      if (occurrence.exceptionReason !== "reschedule") return;
      expect(isSameDay(occurrence.startTime, rescheduleStartDate)).toEqual(
        true,
      );
      expect(isSameDay(occurrence.endTime, rescheduleEndDate)).toEqual(true);
    });
  });
});
