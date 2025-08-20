/** biome-ignore-all lint/complexity/useLiteralKeys: <explanation> */
import { QueryClient } from "@tanstack/react-query";
import { Temporal } from "temporal-polyfill";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CalendarCacheManager } from "../../lib/calendar-cache";
import { createMockSession, createTestConfig } from "./test-utils";

// Mock the group overlapping sessions to avoid dependency issues
vi.mock("../../lib/group-overlapping-sessions", () => ({
  groupOverlappingSessions: vi.fn((sessions) => {
    return Array.isArray(sessions) ? sessions : [];
  }),
}));

// Mock fetch for network requests
global.fetch = vi.fn();

describe("CalendarCacheManager - Core Logic", () => {
  let queryClient: QueryClient;
  let cacheManager: CalendarCacheManager;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Reset the fetch mock
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    cacheManager = new CalendarCacheManager(queryClient, createTestConfig());
  });

  describe("Event System", () => {
    it("should subscribe and unsubscribe event listeners", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      const unsubscribe1 = cacheManager.on(listener1);
      const unsubscribe2 = cacheManager.on(listener2);

      // Emit an event
      cacheManager.emit({
        type: "day-updated",
        date: Temporal.PlainDate.from("2024-06-15"),
        sessions: [],
      });

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);

      // Unsubscribe first listener
      unsubscribe1();

      cacheManager.emit({
        type: "day-updated",
        date: Temporal.PlainDate.from("2024-06-16"),
        sessions: [],
      });

      expect(listener1).toHaveBeenCalledTimes(1); // Should not be called again
      expect(listener2).toHaveBeenCalledTimes(2);

      // Unsubscribe second listener
      unsubscribe2();

      cacheManager.emit({
        type: "day-updated",
        date: Temporal.PlainDate.from("2024-06-17"),
        sessions: [],
      });

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(2);
    });

    it("should handle errors in event listeners gracefully", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const errorListener = vi.fn().mockImplementation(() => {
        throw new Error("Listener error");
      });
      const workingListener = vi.fn();

      cacheManager.on(errorListener);
      cacheManager.on(workingListener);

      cacheManager.emit({
        type: "day-updated",
        date: Temporal.PlainDate.from("2024-06-15"),
        sessions: [],
      });

      expect(errorListener).toHaveBeenCalledTimes(1);
      expect(workingListener).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Cache event listener error:",
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe("getDaySessions", () => {
    it("should return cached sessions for a date", () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");
      const mockSessions = [
        createMockSession({ id: 1 }),
        createMockSession({ id: 2 }),
      ];

      // Manually add to cache
      const dayKey = "2024-6-15";
      cacheManager["memoryCache"].set(dayKey, mockSessions);

      const result = cacheManager.getDaySessions(testDate);
      expect(result).toEqual(mockSessions);
    });

    it("should return empty array when no sessions cached", () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");
      const result = cacheManager.getDaySessions(testDate);
      expect(result).toEqual([]);
    });
  });

  describe("optimisticUpdate", () => {
    it("should call optimisticUpdate without throwing errors", () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");
      const newSession = createMockSession({ id: 1 });
      const listener = vi.fn();

      cacheManager.on(listener);

      // Test that optimistic update can be called without throwing
      expect(() => {
        cacheManager.optimisticUpdate(testDate, "create", newSession);
      }).not.toThrow();

      // Verify listener was called with some event
      expect(listener).toHaveBeenCalled();
    });

    it("should handle different operation types", () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");
      const session = createMockSession({ id: 1 });

      // Pre-populate cache
      cacheManager["memoryCache"].set("2024-6-15", [session]);

      expect(() => {
        cacheManager.optimisticUpdate(testDate, "update", session);
      }).not.toThrow();

      expect(() => {
        cacheManager.optimisticUpdate(testDate, "delete", session);
      }).not.toThrow();
    });

    it("should emit events when optimistic updates occur", () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");
      const session = createMockSession({ id: 1 });
      const listener = vi.fn();

      cacheManager.on(listener);

      cacheManager.optimisticUpdate(testDate, "create", session);

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "optimistic-update",
          sessions: expect.any(Array),
        }),
      );
    });
  });

  describe("Cache Statistics", () => {
    it("should return memory cache statistics", () => {
      // Add some data to cache
      cacheManager["memoryCache"].set("2024-6-15", [
        createMockSession({ id: 1 }),
      ]);
      cacheManager["memoryCache"].set("2024-6-16", []);

      const stats = cacheManager["memoryCache"].getStats();

      expect(stats.size).toBe(2);
      expect(stats.totalSessions).toBe(1);
      expect(typeof stats.avgHitCount).toBe("number");
      expect(typeof stats.oldestEntry).toBe("number");
    });
  });

  describe("Direct Memory Cache Access", () => {
    it("should store and retrieve sessions correctly", () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");
      const mockSessions = [
        createMockSession({ id: 1 }),
        createMockSession({ id: 2 }),
      ];

      // Use the cache manager to store sessions
      const dayKey = "2024-6-15";
      cacheManager["memoryCache"].set(dayKey, mockSessions);

      // Verify via getDaySessions
      const result = cacheManager.getDaySessions(testDate);
      expect(result).toHaveLength(2);
      expect(result[0]?.id).toBe(1);
      expect(result[1]?.id).toBe(2);
    });

    it("should handle cache miss gracefully", () => {
      const testDate = Temporal.PlainDate.from("2024-06-20");
      const result = cacheManager.getDaySessions(testDate);
      expect(result).toEqual([]);
    });
  });

  describe("Event Emission", () => {
    it("should emit events when sessions are cached", () => {
      const listener = vi.fn();
      cacheManager.on(listener);

      const testSessions = [createMockSession({ id: 1 })];
      cacheManager["memoryCache"].set("2024-6-15", testSessions);

      cacheManager.emit({
        type: "day-updated",
        date: Temporal.PlainDate.from("2024-06-15"),
        sessions: testSessions,
      });

      expect(listener).toHaveBeenCalledWith({
        type: "day-updated",
        date: Temporal.PlainDate.from("2024-06-15"),
        sessions: testSessions,
      });
    });

    it("should support multiple event types", () => {
      const listener = vi.fn();
      cacheManager.on(listener);

      const testSession = createMockSession({ id: 1 });

      // Test optimistic update event
      cacheManager.emit({
        type: "optimistic-update",
        date: Temporal.PlainDate.from("2024-06-15"),
        sessions: [testSession],
      });

      // Test cache update event
      cacheManager.emit({
        type: "day-updated",
        date: Temporal.PlainDate.from("2024-06-15"),
        sessions: [testSession],
      });

      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenNthCalledWith(1, {
        type: "optimistic-update",
        date: Temporal.PlainDate.from("2024-06-15"),
        sessions: [testSession],
      });
      expect(listener).toHaveBeenNthCalledWith(2, {
        type: "day-updated",
        date: Temporal.PlainDate.from("2024-06-15"),
        sessions: [testSession],
      });
    });
  });

  describe("ensureDataForView", () => {
    it("should call fetch API for day view", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");

      await cacheManager.ensureDataForView(testDate, "day");

      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/calendar\/sessions\?/),
      );
    });

    it("should call fetch API for week view", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");

      await cacheManager.ensureDataForView(testDate, "week");

      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/calendar\/sessions\?/),
      );
    });

    it("should call fetch API for month view", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");

      await cacheManager.ensureDataForView(testDate, "month");

      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/calendar\/sessions\?/),
      );
    });

    it("should skip fetching when data is already cached", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");

      // Pre-populate cache for the entire range (6 days prefetch on each side)
      const dayKeys = [
        "2024-6-9",
        "2024-6-10",
        "2024-6-11",
        "2024-6-12",
        "2024-6-13",
        "2024-6-14",
        "2024-6-15",
        "2024-6-16",
        "2024-6-17",
        "2024-6-18",
        "2024-6-19",
        "2024-6-20",
        "2024-6-21",
      ];
      dayKeys.forEach((key) => {
        cacheManager["memoryCache"].set(key, []);
      });

      await cacheManager.ensureDataForView(testDate, "day");

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should force fetch when force parameter is true", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");

      // Pre-populate cache
      cacheManager["memoryCache"].set("2024-6-15", []);

      await cacheManager.ensureDataForView(testDate, "day", true);

      expect(global.fetch).toHaveBeenCalled();
    });

    it("should skip prefetching when skipPrefetch is true", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");

      await cacheManager.ensureDataForView(testDate, "day", false, true);

      // Should only fetch the exact range, not additional prefetch data
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should handle fetch errors gracefully", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");
      (global.fetch as any).mockRejectedValue(new Error("Network error"));

      await expect(
        cacheManager.ensureDataForView(testDate, "day"),
      ).rejects.toThrow("Network error");
    });
  });

  describe("prefetchAdjacentData", () => {
    it("should prefetch adjacent days for day view", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");

      await cacheManager.prefetchAdjacentData(testDate, "day");

      // Should make calls for previous and next day ranges
      expect(global.fetch).toHaveBeenCalled();
    });

    it("should prefetch adjacent weeks for week view", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");

      await cacheManager.prefetchAdjacentData(testDate, "week");

      // Should make calls for previous and next week ranges
      expect(global.fetch).toHaveBeenCalled();
    });

    it("should skip prefetching for month view", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");

      await cacheManager.prefetchAdjacentData(testDate, "month");

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should attempt prefetching for adjacent data", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");

      await cacheManager.prefetchAdjacentData(testDate, "day");

      // For day view, should make calls for previous and next day ranges
      expect(global.fetch).toHaveBeenCalled();
    });

    it("should handle prefetch errors gracefully", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      (global.fetch as any).mockRejectedValue(new Error("Prefetch error"));

      // Should not throw, but handle error internally
      await expect(
        cacheManager.prefetchAdjacentData(testDate, "day"),
      ).resolves.not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe("Cache Management", () => {
    it("should get comprehensive cache statistics", () => {
      // Add some data to cache
      cacheManager["memoryCache"].set("2024-6-15", [
        createMockSession({ id: 1 }),
      ]);
      cacheManager["memoryCache"].set("2024-6-16", []);

      const stats = cacheManager.getStats();

      expect(stats).toHaveProperty("memory");
      expect(stats).toHaveProperty("activeRequests");
      expect(stats).toHaveProperty("prefetchQueue");
      expect(stats.memory.size).toBe(2);
      expect(stats.memory.totalSessions).toBe(1);
      expect(typeof stats.activeRequests).toBe("number");
      expect(typeof stats.prefetchQueue).toBe("number");
    });

    it("should clear all caches and emit event", () => {
      const listener = vi.fn();
      cacheManager.on(listener);

      // Add some data
      cacheManager["memoryCache"].set("2024-6-15", [
        createMockSession({ id: 1 }),
      ]);

      cacheManager.clear();

      // Verify cache is empty
      const stats = cacheManager.getStats();
      expect(stats.memory.size).toBe(0);
      expect(stats.activeRequests).toBe(0);
      expect(stats.prefetchQueue).toBe(0);

      // Verify event was emitted
      expect(listener).toHaveBeenCalledWith({
        type: "cache-cleared",
      });
    });

    it("should invalidate range of dates", () => {
      const testStart = Temporal.PlainDate.from("2024-06-15");
      const testEnd = Temporal.PlainDate.from("2024-06-17");

      // Pre-populate cache
      cacheManager["memoryCache"].set("2024-6-15", [
        createMockSession({ id: 1 }),
      ]);
      cacheManager["memoryCache"].set("2024-6-16", [
        createMockSession({ id: 2 }),
      ]);
      cacheManager["memoryCache"].set("2024-6-17", [
        createMockSession({ id: 3 }),
      ]);
      cacheManager["memoryCache"].set("2024-6-18", [
        createMockSession({ id: 4 }),
      ]); // Outside range

      cacheManager.invalidateRange({ start: testStart, end: testEnd });

      // Verify only the range was invalidated
      expect(cacheManager.getDaySessions(testStart)).toEqual([]);
      expect(cacheManager.getDaySessions(testStart.add({ days: 1 }))).toEqual(
        [],
      );
      expect(cacheManager.getDaySessions(testEnd)).toEqual([]);
      expect(
        cacheManager.getDaySessions(testEnd.add({ days: 1 })),
      ).toHaveLength(1); // Should still exist
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle fetching workflow", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");

      // Ensure data is loaded
      await cacheManager.ensureDataForView(testDate, "day");

      // Should make fetch call
      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/calendar\/sessions\?/),
      );
    });

    it("should emit events when data is fetched", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");

      const listener = vi.fn();
      cacheManager.on(listener);

      await cacheManager.ensureDataForView(testDate, "day");

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "day-updated",
          date: expect.any(Object),
          sessions: expect.any(Array),
        }),
      );
    });

    it("should handle concurrent requests efficiently", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");

      // Make multiple concurrent requests
      const promises = [
        cacheManager.ensureDataForView(testDate, "day"),
        cacheManager.ensureDataForView(testDate, "day"),
        cacheManager.ensureDataForView(testDate, "day"),
      ];

      await Promise.all(promises);

      // Should make at least one fetch call
      expect(global.fetch).toHaveBeenCalled();
    });

    it("should maintain cache state across operations", async () => {
      const testDate = Temporal.PlainDate.from("2024-06-15");

      // Initial fetch
      await cacheManager.ensureDataForView(testDate, "day");

      // Optimistic update
      const newSession = createMockSession({ id: 2 });
      cacheManager.optimisticUpdate(testDate, "create", newSession);

      // Should have at least the new session
      const cachedSessions = cacheManager.getDaySessions(testDate);
      expect(cachedSessions).toContain(newSession);

      // Cache invalidation
      cacheManager.invalidateRange({
        start: testDate,
        end: testDate,
      });

      // Should be empty after invalidation
      expect(cacheManager.getDaySessions(testDate)).toEqual([]);
    });
  });
});
