import { beforeEach, describe, expect, it } from "vitest";

import {
  type CalendarCacheConfig,
  MemoryCache,
} from "../../lib/calendar-cache";
import type { LayoutCalendarSession } from "../../types/calendar.types";

// Mock session data for testing
const createMockSession = (
  overrides: Partial<LayoutCalendarSession> = {},
): LayoutCalendarSession => ({
  id: 1,
  startTime: "2024-01-01T09:00:00.000Z",
  endTime: "2024-01-01T10:00:00.000Z",
  status: "upcoming",
  students: [],
  hub: {
    id: 1,
    name: "Test Hub",
    color: "blueberry",
  },
  columnIndex: 0,
  totalColumns: 1,
  ...overrides,
});

describe("MemoryCache", () => {
  let cache: MemoryCache;
  let mockConfig: CalendarCacheConfig;

  beforeEach(() => {
    mockConfig = {
      maxMemoryCacheSize: 3,
      maxMemoryCacheAge: 5000, // 5 seconds
      prefetchDistance: 7,
      batchSize: 7,
    };
    cache = new MemoryCache(mockConfig);
  });

  describe("Basic Operations", () => {
    it("should store and retrieve sessions", () => {
      const sessions = [createMockSession({ id: 1 })];
      cache.set("2024-01-01", sessions);

      const retrieved = cache.get("2024-01-01");
      expect(retrieved).toEqual(sessions);
      expect(retrieved).not.toBe(sessions); // Should be immutable copy
    });

    it("should return null for non-existent keys", () => {
      expect(cache.get("2024-01-01")).toBeNull();
    });

    it("should check if key exists", () => {
      expect(cache.has("2024-01-01")).toBe(false);

      cache.set("2024-01-01", []);
      expect(cache.has("2024-01-01")).toBe(true);
    });

    it("should delete entries", () => {
      cache.set("2024-01-01", []);
      expect(cache.has("2024-01-01")).toBe(true);

      const deleted = cache.delete("2024-01-01");
      expect(deleted).toBe(true);
      expect(cache.has("2024-01-01")).toBe(false);
    });

    it("should return false when deleting non-existent key", () => {
      const deleted = cache.delete("2024-01-01");
      expect(deleted).toBe(false);
    });

    it("should clear all entries", () => {
      cache.set("2024-01-01", []);
      cache.set("2024-01-02", []);

      cache.clear();
      expect(cache.getCacheSize()).toBe(0);
      expect(cache.getAccessOrder()).toEqual([]);
    });
  });

  describe("LRU Eviction", () => {
    it("should evict least recently used item when cache is full", () => {
      // Fill cache to capacity
      cache.set("2024-01-01", [createMockSession({ id: 1 })]);
      cache.set("2024-01-02", [createMockSession({ id: 2 })]);
      cache.set("2024-01-03", [createMockSession({ id: 3 })]);

      expect(cache.getCacheSize()).toBe(3);

      // Add one more item - should evict the first one
      cache.set("2024-01-04", [createMockSession({ id: 4 })]);

      expect(cache.getCacheSize()).toBe(3);
      expect(cache.has("2024-01-01")).toBe(false); // Should be evicted
      expect(cache.has("2024-01-02")).toBe(true);
      expect(cache.has("2024-01-03")).toBe(true);
      expect(cache.has("2024-01-04")).toBe(true);
    });

    it("should update access order when getting items", () => {
      cache.set("2024-01-01", []);
      cache.set("2024-01-02", []);
      cache.set("2024-01-03", []);

      // Access first item to make it most recently used
      cache.get("2024-01-01");

      // Add new item - should evict 2024-01-02 (now LRU)
      cache.set("2024-01-04", []);

      expect(cache.has("2024-01-01")).toBe(true); // Should not be evicted
      expect(cache.has("2024-01-02")).toBe(false); // Should be evicted
      expect(cache.has("2024-01-03")).toBe(true);
      expect(cache.has("2024-01-04")).toBe(true);
    });

    it("should not evict when updating existing key", () => {
      cache.set("2024-01-01", [createMockSession({ id: 1 })]);
      cache.set("2024-01-02", [createMockSession({ id: 2 })]);
      cache.set("2024-01-03", [createMockSession({ id: 3 })]);

      // Update existing key - should not trigger eviction
      cache.set("2024-01-02", [
        createMockSession({ id: 2, startTime: "2024-01-01T10:00:00.000Z" }),
      ]);

      expect(cache.getCacheSize()).toBe(3);
      expect(cache.has("2024-01-01")).toBe(true);
      expect(cache.has("2024-01-02")).toBe(true);
      expect(cache.has("2024-01-03")).toBe(true);
    });

    it("should maintain correct access order", () => {
      cache.set("2024-01-01", []);
      cache.set("2024-01-02", []);

      expect(cache.getAccessOrder()).toEqual(["2024-01-01", "2024-01-02"]);

      // Access first item
      cache.get("2024-01-01");
      expect(cache.getAccessOrder()).toEqual(["2024-01-02", "2024-01-01"]);
    });
  });

  describe("Expiration", () => {
    it("should return null for expired entries", async () => {
      const shortConfig: CalendarCacheConfig = {
        maxMemoryCacheSize: 10,
        maxMemoryCacheAge: 100, // 100ms
        prefetchDistance: 7,
        batchSize: 7,
      };
      const shortCache = new MemoryCache(shortConfig);

      shortCache.set("2024-01-01", [createMockSession({ id: 1 })]);
      expect(shortCache.get("2024-01-01")).not.toBeNull();

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(shortCache.get("2024-01-01")).toBeNull();
      expect(shortCache.has("2024-01-01")).toBe(false);
    });

    it("should remove expired entries from cache and access order", async () => {
      const shortConfig: CalendarCacheConfig = {
        maxMemoryCacheSize: 10,
        maxMemoryCacheAge: 100,
        prefetchDistance: 7,
        batchSize: 7,
      };
      const shortCache = new MemoryCache(shortConfig);

      shortCache.set("2024-01-01", []);
      expect(shortCache.getCacheSize()).toBe(1);
      expect(shortCache.getAccessOrder()).toEqual(["2024-01-01"]);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Access expired entry
      shortCache.get("2024-01-01");

      expect(shortCache.getCacheSize()).toBe(0);
      expect(shortCache.getAccessOrder()).toEqual([]);
    });
  });

  describe("Statistics", () => {
    it("should track hit counts", () => {
      cache.set("2024-01-01", [
        createMockSession({ id: 1 }),
        createMockSession({ id: 2 }),
      ]);

      // Access multiple times
      cache.get("2024-01-01");
      cache.get("2024-01-01");
      cache.get("2024-01-01");

      const stats = cache.getStats();
      expect(stats.avgHitCount).toBe(4); // 1 from set + 3 from gets
    });

    it("should calculate total sessions correctly", () => {
      cache.set("2024-01-01", [
        createMockSession({ id: 1 }),
        createMockSession({ id: 2 }),
      ]);
      cache.set("2024-01-02", [createMockSession({ id: 3 })]);

      const stats = cache.getStats();
      expect(stats.totalSessions).toBe(3);
      expect(stats.size).toBe(2);
    });

    it("should track oldest entry timestamp", () => {
      const now = Date.now();

      cache.set("2024-01-01", []);
      const stats = cache.getStats();

      expect(stats.oldestEntry).toBeGreaterThanOrEqual(now);
      expect(stats.oldestEntry).toBeLessThanOrEqual(Date.now());
    });

    it("should handle empty cache stats", () => {
      const stats = cache.getStats();

      expect(stats.size).toBe(0);
      expect(stats.totalSessions).toBe(0);
      expect(stats.avgHitCount).toBe(0);
      expect(stats.oldestEntry).toBe(Number.POSITIVE_INFINITY);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty sessions array", () => {
      cache.set("2024-01-01", []);

      const retrieved = cache.get("2024-01-01");
      expect(retrieved).toEqual([]);
    });

    it("should handle complex session objects", () => {
      const complexSession = createMockSession({
        id: 1,
        students: [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            image: null,
          },
        ],
      });

      cache.set("2024-01-01", [complexSession]);

      const retrieved = cache.get("2024-01-01");
      expect(retrieved).toEqual([complexSession]);
      expect(retrieved).not.toBe([complexSession]); // Array should be copy
      expect(retrieved?.[0]).toBe(complexSession); // Objects are shallow copied (same reference)
    });

    it("should handle date key formats", () => {
      const testKeys = [
        "2024-1-1",
        "2024-12-31",
        "2024-02-29", // Leap year
        "2023-02-28", // Non-leap year
      ];

      testKeys.forEach((key, index) => {
        cache.set(key, [createMockSession({ id: index })]);
        expect(cache.has(key)).toBe(true);
      });
    });

    it("should handle concurrent operations", () => {
      const operations = [];

      // Simulate concurrent sets
      for (let i = 0; i < 10; i++) {
        operations.push(() =>
          cache.set(`2024-01-${i.toString().padStart(2, "0")}`, [
            createMockSession({ id: i }),
          ]),
        );
      }

      // Simulate concurrent gets
      for (let i = 0; i < 10; i++) {
        operations.push(() =>
          cache.get(`2024-01-${i.toString().padStart(2, "0")}`),
        );
      }

      // Execute all operations
      operations.forEach((op) => op());

      // Should maintain consistency
      expect(cache.getCacheSize()).toBeLessThanOrEqual(
        mockConfig.maxMemoryCacheSize,
      );
    });
  });
});
