import { Temporal } from "temporal-polyfill";
import { beforeEach, describe, expect, it } from "vitest";

import { DateRangeCalculator, MemoryCache } from "../../lib/calendar-cache";

describe("DateRangeCalculator", () => {
  let memoryCache: MemoryCache;
  let testDate: Temporal.PlainDate;

  beforeEach(() => {
    memoryCache = new MemoryCache({
      maxMemoryCacheSize: 100,
      maxMemoryCacheAge: 60000,
      prefetchDistance: 3,
      batchSize: 7,
    });
    testDate = Temporal.PlainDate.from("2024-06-15"); // Saturday
  });

  describe("getOptimalFetchRange", () => {
    describe("Day View", () => {
      it("should calculate correct range for day view with prefetch", () => {
        const range = DateRangeCalculator.getOptimalFetchRange(
          testDate,
          "day",
          3,
        );

        expect(range.start.toString()).toBe("2024-06-12");
        expect(range.end.toString()).toBe("2024-06-18");
      });

      it("should handle day view with zero prefetch", () => {
        const range = DateRangeCalculator.getOptimalFetchRange(
          testDate,
          "day",
          0,
        );

        expect(range.start.toString()).toBe("2024-06-15");
        expect(range.end.toString()).toBe("2024-06-15");
      });

      it("should limit prefetch for day view to maximum 6 days", () => {
        const range = DateRangeCalculator.getOptimalFetchRange(
          testDate,
          "day",
          10, // Should be capped at 3
        );

        expect(range.start.toString()).toBe("2024-06-09");
        expect(range.end.toString()).toBe("2024-06-21");
      });
    });

    describe("Week View", () => {
      it("should calculate correct range for week view", () => {
        const range = DateRangeCalculator.getOptimalFetchRange(
          testDate,
          "week",
          7,
        );

        // June 15 2024 is Saturday, week should be Monday (10th) to Sunday (16th)
        expect(range.start.toString()).toBe("2024-06-03"); // Previous Monday
        expect(range.end.toString()).toBe("2024-06-23"); // Next Sunday
      });

      it("should handle week view with zero prefetch", () => {
        const range = DateRangeCalculator.getOptimalFetchRange(
          testDate,
          "week",
          0,
        );

        // Should be just the current week
        expect(range.start.toString()).toBe("2024-06-10"); // Monday of current week
        expect(range.end.toString()).toBe("2024-06-16"); // Sunday of current week
      });
    });

    describe("Month View", () => {
      it("should calculate correct range for month view", () => {
        const range = DateRangeCalculator.getOptimalFetchRange(
          testDate,
          "month",
          0,
        );

        // Month view should include the full calendar grid
        expect(range.start).toBeDefined();
        expect(range.end).toBeDefined();
      });
    });
  });

  describe("splitRangeIntoBatches", () => {
    it("should split large range into correct batches", () => {
      const range = {
        start: Temporal.PlainDate.from("2024-06-01"),
        end: Temporal.PlainDate.from("2024-06-05"),
      };

      const batches = DateRangeCalculator.splitRangeIntoBatches(range, 7);

      expect(batches).toHaveLength(1);
      expect(batches[0]?.start.toString()).toBe("2024-06-01");
      expect(batches[0]?.end.toString()).toBe("2024-06-05");
    });

    it("should split large range into multiple batches", () => {
      const range = {
        start: Temporal.PlainDate.from("2024-06-01"),
        end: Temporal.PlainDate.from("2024-06-15"),
      };

      const batches = DateRangeCalculator.splitRangeIntoBatches(range, 7);

      expect(batches).toHaveLength(3);
      expect(batches[0]?.start.toString()).toBe("2024-06-01");
      expect(batches[0]?.end.toString()).toBe("2024-06-07");
      expect(batches[1]?.start.toString()).toBe("2024-06-08");
      expect(batches[1]?.end.toString()).toBe("2024-06-14");
      expect(batches[2]?.start.toString()).toBe("2024-06-15");
      expect(batches[2]?.end.toString()).toBe("2024-06-15");
    });
  });

  describe("isRangeCached", () => {
    beforeEach(() => {
      // Cache some specific days with empty session arrays
      memoryCache.set("2024-6-10", []);
      memoryCache.set("2024-6-11", []);
      memoryCache.set("2024-6-12", []);
    });

    it("should return true when entire range is cached", () => {
      const range = {
        start: Temporal.PlainDate.from("2024-06-10"),
        end: Temporal.PlainDate.from("2024-06-12"),
      };

      const isCached = DateRangeCalculator.isRangeCached(range, memoryCache);
      expect(isCached).toBe(true);
    });

    it("should return false when some days are missing", () => {
      const range = {
        start: Temporal.PlainDate.from("2024-06-10"),
        end: Temporal.PlainDate.from("2024-06-14"), // 13th and 14th not cached
      };

      const isCached = DateRangeCalculator.isRangeCached(range, memoryCache);
      expect(isCached).toBe(false);
    });
  });

  describe("getMissingRanges", () => {
    beforeEach(() => {
      // Cache some specific days: 10, 11, 12 with empty session arrays
      memoryCache.set("2024-6-10", []);
      memoryCache.set("2024-6-11", []);
      memoryCache.set("2024-6-12", []);
    });

    it("should return empty array when entire range is cached", () => {
      const range = {
        start: Temporal.PlainDate.from("2024-06-10"),
        end: Temporal.PlainDate.from("2024-06-12"),
      };

      const missing = DateRangeCalculator.getMissingRanges(range, memoryCache);
      expect(missing).toHaveLength(0);
    });

    it("should return single missing range", () => {
      const range = {
        start: Temporal.PlainDate.from("2024-06-20"),
        end: Temporal.PlainDate.from("2024-06-25"),
      };

      const missing = DateRangeCalculator.getMissingRanges(range, memoryCache);
      expect(missing).toHaveLength(1);
      expect(missing[0]?.start.toString()).toBe("2024-06-20");
      expect(missing[0]?.end.toString()).toBe("2024-06-25");
    });
  });
});
