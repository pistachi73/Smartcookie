import { addMonths } from "date-fns";
import { datetime, RRule } from "rrule";
import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";

import { calculateRecurrentSessions } from "../calculate-recurrent-sessions";

// Helper function to create expected timestamps using Temporal API
const createExpectedTimestamp = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
) => {
  const userTimezone = Temporal.Now.timeZoneId();
  const dateTime = Temporal.PlainDateTime.from({
    year,
    month,
    day,
    hour,
    minute,
  });
  return dateTime.toZonedDateTime(userTimezone).toInstant().toString();
};

describe("calculateRecurrentSessions", () => {
  const baseDate = new Date(2023, 0, 10); // January 10, 2023
  const hubStartsOn = baseDate.toISOString();
  const hubEndsOn = addMonths(baseDate, 2).toISOString(); // March 10, 2023

  const baseParams = {
    hubStartsOn,
    hubEndsOn,
    date: {
      day: 15,
      month: 1,
      year: 2023,
    },
    startTime: {
      hour: 10,
      minute: 0,
    },
    endTime: {
      hour: 11,
      minute: 30,
    },
  };

  it("should create a single session when no recurrence rule is provided", () => {
    const sessions = calculateRecurrentSessions(baseParams);

    expect(sessions).toHaveLength(1);

    const session = sessions[0];
    expect(session).toEqual({
      startTime: createExpectedTimestamp(2023, 1, 15, 10, 0),
      endTime: createExpectedTimestamp(2023, 1, 15, 11, 30),
    });
  });

  it("should create multiple sessions based on daily recurrence rule with count", () => {
    const rrule = new RRule({
      freq: RRule.DAILY,
      interval: 2, // Every 2 days
      count: 5, // Only 5 occurrences
      dtstart: datetime(2023, 1, 15),
    });

    const sessions = calculateRecurrentSessions({
      ...baseParams,
      rruleStr: rrule.toString(),
    });

    // Should have 5 sessions as specified by count
    expect(sessions).toHaveLength(5);

    // Check the first session is correct
    const firstSession = sessions[0];
    expect(firstSession).toBeDefined();
    if (firstSession) {
      expect(firstSession).toEqual({
        startTime: createExpectedTimestamp(2023, 1, 15, 10, 0),
        endTime: createExpectedTimestamp(2023, 1, 15, 11, 30),
      });
    }

    // Check second session is 2 days later
    const secondSession = sessions[1];
    expect(secondSession).toBeDefined();
    if (secondSession) {
      expect(secondSession).toEqual({
        startTime: createExpectedTimestamp(2023, 1, 17, 10, 0),
        endTime: createExpectedTimestamp(2023, 1, 17, 11, 30),
      });
    }

    // Check last session is the 5th occurrence
    const lastSession = sessions[sessions.length - 1];
    expect(lastSession).toBeDefined();
    if (lastSession) {
      expect(lastSession).toEqual({
        startTime: createExpectedTimestamp(2023, 1, 23, 10, 0),
        endTime: createExpectedTimestamp(2023, 1, 23, 11, 30),
      });
    }
  });

  it("should create multiple sessions based on daily recurrence rule with until date", () => {
    const rrule = new RRule({
      freq: RRule.DAILY,
      interval: 2, // Every 2 days
      until: datetime(2023, 2, 15), // Until February 15
      dtstart: datetime(2023, 1, 15),
    });

    const sessions = calculateRecurrentSessions({
      ...baseParams,
      rruleStr: rrule.toString(),
    });

    // From Jan 10 (hub start) to Feb 15 (until date), every 2 days
    // Expected dates: Jan 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, Feb 2, 4, 6, 8, 10, 12, 14, 15 = 19 sessions
    expect(sessions).toHaveLength(19);

    // Check the first session is correct (starts from hub start date)
    const firstSession = sessions[0];
    expect(firstSession).toBeDefined();
    if (firstSession) {
      expect(firstSession).toEqual({
        startTime: createExpectedTimestamp(2023, 1, 10, 10, 0),
        endTime: createExpectedTimestamp(2023, 1, 10, 11, 30),
      });
    }

    // Check last session is on Feb 15 (last occurrence on until date)
    const lastSession = sessions[sessions.length - 1];
    expect(lastSession).toBeDefined();
    if (lastSession) {
      expect(lastSession).toEqual({
        startTime: createExpectedTimestamp(2023, 2, 15, 10, 0),
        endTime: createExpectedTimestamp(2023, 2, 15, 11, 30),
      });
    }
  });

  it("should create multiple sessions based on weekly recurrence rule", () => {
    const rrule = new RRule({
      freq: RRule.WEEKLY,
      interval: 1, // Every week
      byweekday: [RRule.MO, RRule.WE, RRule.FR], // Monday, Wednesday, Friday
      dtstart: datetime(2023, 1, 16), // Start on a Monday (Jan 16, 2023)
    });

    const sessions = calculateRecurrentSessions({
      ...baseParams,
      date: {
        day: 16,
        month: 1,
        year: 2023,
      },
      rruleStr: rrule.toString(),
    });

    // From Jan 10 (hub start) to March 10 (hub end):
    // Jan: 11(W), 13(F), 16(M), 18(W), 20(F), 23(M), 25(W), 27(F), 30(M)
    // Feb: 1(W), 3(F), 6(M), 8(W), 10(F), 13(M), 15(W), 17(F), 20(M), 22(W), 24(F), 27(M)
    // Mar: 1(W), 3(F), 6(M), 8(W), 10(F)
    // Total: 26 sessions
    expect(sessions).toHaveLength(26);

    // Verify first session is on Jan 11 (Wednesday, first occurrence after hub start)
    expect(
      sessions[0]?.startTime ? new Date(sessions[0].startTime).getDay() : null,
    ).toBe(3); // Wednesday (Jan 11)

    // Verify times for all sessions
    for (const session of sessions) {
      const startDate = new Date(session.startTime);
      const endDate = new Date(session.endTime);

      // Day should be Monday (1), Wednesday (3), or Friday (5)
      expect([1, 3, 5]).toContain(startDate.getDay());

      // Times should be consistent
      expect(startDate.getHours()).toBe(10);
      expect(startDate.getMinutes()).toBe(0);
      expect(endDate.getHours()).toBe(11);
      expect(endDate.getMinutes()).toBe(30);
    }
  });

  it("should create multiple sessions based on monthly recurrence rule", () => {
    const rrule = new RRule({
      freq: RRule.MONTHLY,
      interval: 1, // Every month
      bymonthday: [15], // On the 15th of each month
      dtstart: datetime(2023, 1, 15), // Consistent with rrule's 1-indexed months
    });

    const sessions = calculateRecurrentSessions({
      ...baseParams,
      rruleStr: rrule.toString(),
    });

    // Should have sessions on the 15th of each month within hub period
    expect(sessions.length).toEqual(2);

    const firstSession = sessions[0];
    expect(firstSession).toBeDefined();
    if (firstSession) {
      expect(firstSession).toEqual({
        startTime: createExpectedTimestamp(2023, 1, 15, 10, 0),
        endTime: createExpectedTimestamp(2023, 1, 15, 11, 30),
      });
    }

    const secondSession = sessions[1];
    expect(secondSession).toBeDefined();
    if (secondSession) {
      expect(secondSession).toEqual({
        startTime: createExpectedTimestamp(2023, 2, 15, 10, 0),
        endTime: createExpectedTimestamp(2023, 2, 15, 11, 30),
      });
    }
  });

  it("should use default end date when hubEndsOn is not provided", () => {
    const { hubEndsOn, ...paramsWithoutEndDate } = baseParams;

    const rrule = new RRule({
      freq: RRule.MONTHLY,
      interval: 1,
      dtstart: datetime(2023, 1, 15),
    });

    const sessions = calculateRecurrentSessions({
      ...paramsWithoutEndDate,
      rruleStr: rrule.toString(),
    });

    // Should have sessions for 3 months from the start date (default behavior: 2 months from rrule start)
    expect(sessions.length).toBe(3);

    if (sessions.length > 0) {
      // First session should be in January
      const firstSession = sessions[0];
      if (firstSession) {
        const firstSessionDate = new Date(firstSession.startTime);
        expect(firstSessionDate.getMonth()).toBe(0); // January
        expect(firstSessionDate.getDate()).toBe(15);
      }

      // Last session should be in March
      const lastSession = sessions[sessions.length - 1];
      if (lastSession) {
        const lastSessionDate = new Date(lastSession.startTime);
        expect(lastSessionDate.getMonth()).toBe(2); // March
        expect(lastSessionDate.getDate()).toBe(15);
      }
    }
  });

  it("should respect rrule until date when it's earlier than hub end date", () => {
    const rrule = new RRule({
      freq: RRule.DAILY,
      interval: 1, // Every day
      until: datetime(2023, 1, 20), // Until January 20
      dtstart: datetime(2023, 1, 15),
    });

    const sessions = calculateRecurrentSessions({
      ...baseParams,
      rruleStr: rrule.toString(),
    });

    // Should have sessions from Jan 10 (hub start) to Jan 20 (until date) = 11 sessions
    expect(sessions.length).toBe(11);

    // Check first session
    expect(sessions[0]).toEqual({
      startTime: createExpectedTimestamp(2023, 1, 10, 10, 0),
      endTime: createExpectedTimestamp(2023, 1, 10, 11, 30),
    });

    // Check last session
    expect(sessions[sessions.length - 1]).toEqual({
      startTime: createExpectedTimestamp(2023, 1, 20, 10, 0),
      endTime: createExpectedTimestamp(2023, 1, 20, 11, 30),
    });
  });

  it("should respect hub end date when it's earlier than rrule until date", () => {
    const rrule = new RRule({
      freq: RRule.DAILY,
      interval: 1, // Every day
      until: datetime(2023, 4, 15), // Until April 15
      dtstart: datetime(2023, 1, 15),
    });

    const sessions = calculateRecurrentSessions({
      ...baseParams,
      rruleStr: rrule.toString(),
    });

    // Should have sessions from Jan 10 (hub start) to March 10 (hub end date)
    // Jan: 10-31 (22 days), Feb: 1-28 (28 days), Mar: 1-10 (10 days) = 60 sessions
    expect(sessions.length).toBe(60);

    // Check first session
    expect(sessions[0]).toEqual({
      startTime: createExpectedTimestamp(2023, 1, 10, 10, 0),
      endTime: createExpectedTimestamp(2023, 1, 10, 11, 30),
    });

    // Check last session should be on March 10
    expect(sessions[sessions.length - 1]).toEqual({
      startTime: createExpectedTimestamp(2023, 3, 10, 10, 0),
      endTime: createExpectedTimestamp(2023, 3, 10, 11, 30),
    });
  });

  it("should calculate duration correctly for sessions", () => {
    const rrule = new RRule({
      freq: RRule.DAILY,
      count: 3, // Just 3 occurrences
      dtstart: datetime(2023, 1, 15),
    });

    // Test with a different duration (2 hours and 15 minutes)
    const sessions = calculateRecurrentSessions({
      ...baseParams,
      startTime: { hour: 14, minute: 30 }, // 2:30 PM
      endTime: { hour: 16, minute: 45 }, // 4:45 PM
      rruleStr: rrule.toString(),
    });

    expect(sessions.length).toBe(3);

    sessions.forEach((session) => {
      if (session) {
        const startTime = new Date(session.startTime);
        const endTime = new Date(session.endTime);

        // Duration should be 2 hours and 15 minutes
        const durationMs = endTime.getTime() - startTime.getTime();
        const durationMinutes = durationMs / (1000 * 60);

        expect(durationMinutes).toBe(135); // 2h15m = 135 minutes
      }
    });
  });
});
