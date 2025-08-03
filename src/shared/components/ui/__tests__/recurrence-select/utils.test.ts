import { RRule } from "rrule";
import { describe, expect, it } from "vitest";

import {
  parseRruleText,
  rruleLanguage,
} from "@/shared/components/ui/recurrence-select/utils";

import { getWeekdayCardinal } from "@/features/calendar/lib/calendar";

describe("getWeekdayCardinal", () => {
  it("returns correct cardinal for first occurrence of weekday", () => {
    // First Monday of January 2023
    const date = new Date(2023, 0, 2);
    const result = getWeekdayCardinal(date);

    expect(result.cardinal).toBe(1);
    expect(result.label).toBe("1st");
  });

  it("returns correct cardinal for second occurrence of weekday", () => {
    // Second Monday of January 2023
    const date = new Date(2023, 0, 9);
    const result = getWeekdayCardinal(date);

    expect(result.cardinal).toBe(2);
    expect(result.label).toBe("2nd");
  });

  it("returns correct cardinal for third occurrence of weekday", () => {
    // Third Monday of January 2023
    const date = new Date(2023, 0, 16);
    const result = getWeekdayCardinal(date);

    expect(result.cardinal).toBe(3);
    expect(result.label).toBe("3rd");
  });

  it("returns correct cardinal for fourth occurrence of weekday", () => {
    // Fourth Monday of January 2023
    const date = new Date(2023, 0, 23);
    const result = getWeekdayCardinal(date);

    expect(result.cardinal).toBe(4);
    expect(result.label).toBe("4th");
  });

  it("returns -1 as cardinal for last occurrence of weekday in month", () => {
    // Fifth and last Monday of January 2023
    const date = new Date(2023, 0, 30);
    const result = getWeekdayCardinal(date);

    expect(result.cardinal).toBe(-1);
    expect(result.label).toBe("5th");
  });

  it("handles last occurrence correctly even when not the 5th occurrence", () => {
    // Fourth and last Thursday of February 2023 (non-leap year)
    const date = new Date(2023, 1, 23);
    const result = getWeekdayCardinal(date);

    expect(result.cardinal).toBe(-1);
    expect(result.label).toBe("4th");
  });
});

describe("parseRruleText", () => {
  it("returns default text when rrule string is not provided", () => {
    const result = parseRruleText();

    expect(result.label).toBe("Does not repeat");
    expect(result.auxLabel).toBe("");
  });

  it("correctly parses daily frequency with interval 1", () => {
    const rrule = new RRule({
      freq: RRule.DAILY,
      interval: 1,
    });

    const result = parseRruleText(rrule.toString());

    expect(result.label).toBe("Every day");
    expect(result.auxLabel).toBe("");
  });

  it("correctly parses daily frequency with interval greater than 1", () => {
    const rrule = new RRule({
      freq: RRule.DAILY,
      interval: 3,
    });

    const result = parseRruleText(rrule.toString());

    expect(result.label).toBe("Every 3 days");
    expect(result.auxLabel).toBe("");
  });

  it("correctly parses weekly frequency", () => {
    const rrule = new RRule({
      freq: RRule.WEEKLY,
      interval: 1,
    });

    const result = parseRruleText(rrule.toString());

    expect(result.label).toBe("Every week");
    expect(result.auxLabel).toBe("");
  });

  it("correctly parses monthly frequency", () => {
    const rrule = new RRule({
      freq: RRule.MONTHLY,
      interval: 1,
    });

    const result = parseRruleText(rrule.toString());

    expect(result.label).toBe("Every month");
    expect(result.auxLabel).toBe("");
  });

  it("correctly parses yearly frequency", () => {
    const rrule = new RRule({
      freq: RRule.YEARLY,
      interval: 1,
    });

    const result = parseRruleText(rrule.toString());

    expect(result.label).toBe("Every year");
    expect(result.auxLabel).toBe("");
  });

  it("correctly parses frequency with end date", () => {
    const rrule = new RRule({
      freq: RRule.WEEKLY,
      interval: 1,
      until: new Date(2023, 11, 31), // December 31, 2023
    });

    const result = parseRruleText(rrule.toString());

    expect(result.label).toBe("Every week");
    // Make the test timezone-agnostic by checking what RRule actually generates with custom language
    const expectedAuxText = rrule
      .toText(undefined, rruleLanguage)
      .split(" ")
      .slice(2)
      .join(" ");
    expect(result.auxLabel).toBe(expectedAuxText);
  });

  it("correctly parses frequency with count", () => {
    const rrule = new RRule({
      freq: RRule.MONTHLY,
      interval: 1,
      count: 5,
    });

    const result = parseRruleText(rrule.toString());

    expect(result.label).toBe("Every month");
    expect(result.auxLabel).toBe("for 5 times");
  });

  it("correctly parses weekly frequency with specific days", () => {
    const rrule = new RRule({
      freq: RRule.WEEKLY,
      interval: 1,
      byweekday: [RRule.MO, RRule.WE, RRule.FR],
    });

    const result = parseRruleText(rrule.toString());

    expect(result.label).toBe("Every week");
    expect(result.auxLabel).toContain("on Mon, Wed, Fri");
  });
});
