import type { CalendarCacheConfig } from "../../lib/calendar-cache";
import type { LayoutCalendarSession } from "../../types/calendar.types";

/**
 * Create a mock LayoutCalendarSession for testing
 */
export const createMockSession = (
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

/**
 * Create a test configuration for cache manager
 */
export const createTestConfig = (
  overrides: Partial<CalendarCacheConfig> = {},
): CalendarCacheConfig => ({
  maxMemoryCacheSize: 10,
  maxMemoryCacheAge: 5000, // 5 seconds
  prefetchDistance: 7,
  batchSize: 7,
  ...overrides,
});
