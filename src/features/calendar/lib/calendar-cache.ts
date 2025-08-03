import type { QueryClient } from "@tanstack/react-query";
import { Temporal } from "temporal-polyfill";

import type {
  CalendarSession,
  LayoutCalendarSession,
} from "../types/calendar.types";
import { groupOverlappingSessions } from "./group-overlapping-sessions";
import { organizeSessionsByDay } from "./organize-sessions-by-day";
import { getDayKeyFromDate, getMonthViewDateRange } from "./utils";

/**
 * Multi-tier calendar cache architecture for optimal performance
 * Tier 1: In-memory cache for immediate access
 * Tier 2: React Query cache for network state management
 * Tier 3: Background prefetching for predictive loading
 */

// ===============================
// TYPES & CONSTANTS
// ===============================

export interface CacheRange {
  start: Temporal.PlainDate;
  end: Temporal.PlainDate;
}

export interface CacheMetadata {
  lastFetched: number;
  hitCount: number;
  size: number;
}

export interface CacheEntry {
  sessions: LayoutCalendarSession[];
  metadata: CacheMetadata;
}

export interface CalendarCacheConfig {
  maxMemoryCacheSize: number;
  maxMemoryCacheAge: number; // milliseconds
  prefetchDistance: number; // days to prefetch ahead/behind
  batchSize: number; // days to fetch in single request
}

// ===============================
// CACHE CHANGE EVENTS
// ===============================

export type CacheChangeEventType =
  | "day-updated"
  | "day-cleared"
  | "range-updated"
  | "cache-cleared"
  | "optimistic-update";

export interface CacheChangeEvent {
  type: CacheChangeEventType;
  date?: Temporal.PlainDate;
  dateRange?: CacheRange;
  sessions?: LayoutCalendarSession[];
}

export type CacheEventListener = (event: CacheChangeEvent) => void;

export interface CacheEventEmitter {
  on(listener: CacheEventListener): () => void; // Returns unsubscribe function
  emit(event: CacheChangeEvent): void;
}

const DEFAULT_CONFIG: CalendarCacheConfig = {
  maxMemoryCacheSize: 150, // Increased for month view support
  maxMemoryCacheAge: 30 * 60 * 1000, // 30 minutes
  prefetchDistance: 14, // 2 weeks ahead/behind (will be adjusted per view)
  batchSize: 7, // 1 week batches
};

// ===============================
// MEMORY CACHE (TIER 1)
// ===============================

export class MemoryCache {
  private cache = new Map<string, CacheEntry>();
  private accessOrder: string[] = [];

  constructor(private config: CalendarCacheConfig) {}

  get(dayKey: string): LayoutCalendarSession[] | null {
    const entry = this.cache.get(dayKey);
    if (!entry) return null;

    // Check if expired
    if (
      Date.now() - entry.metadata.lastFetched >
      this.config.maxMemoryCacheAge
    ) {
      this.delete(dayKey);
      return null;
    }

    // Update access order and hit count
    this.updateAccessOrder(dayKey);
    entry.metadata.hitCount++;

    return entry.sessions;
  }

  set(dayKey: string, sessions: LayoutCalendarSession[]): void {
    // Enforce size limit with LRU eviction
    if (
      this.cache.size >= this.config.maxMemoryCacheSize &&
      !this.cache.has(dayKey)
    ) {
      this.evictLRU();
    }

    const entry: CacheEntry = {
      sessions: [...sessions], // immutable copy
      metadata: {
        lastFetched: Date.now(),
        hitCount: 1,
        size: sessions.length,
      },
    };

    this.cache.set(dayKey, entry);
    this.updateAccessOrder(dayKey);
  }

  delete(dayKey: string): boolean {
    const deleted = this.cache.delete(dayKey);
    if (deleted) {
      this.accessOrder = this.accessOrder.filter((key) => key !== dayKey);
    }
    return deleted;
  }

  has(dayKey: string): boolean {
    return this.cache.has(dayKey) && this.get(dayKey) !== null;
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  getStats() {
    const entries = Array.from(this.cache.values());
    return {
      size: this.cache.size,
      totalSessions: entries.reduce(
        (acc, entry) => acc + entry.metadata.size,
        0,
      ),
      avgHitCount:
        entries.reduce((acc, entry) => acc + entry.metadata.hitCount, 0) /
          entries.length || 0,
      oldestEntry: Math.min(
        ...entries.map((entry) => entry.metadata.lastFetched),
      ),
    };
  }

  // Test utility methods
  getAccessOrder(): string[] {
    return [...this.accessOrder];
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  private updateAccessOrder(dayKey: string): void {
    this.accessOrder = this.accessOrder.filter((key) => key !== dayKey);
    this.accessOrder.push(dayKey);
  }

  private evictLRU(): void {
    const lruKey = this.accessOrder[0];
    if (lruKey) {
      this.delete(lruKey);
    }
  }
}

// ===============================
// RANGE CALCULATOR
// ===============================

// biome-ignore lint/complexity/noStaticOnlyClass: utility class with static methods for date range calculations
export class DateRangeCalculator {
  /**
   * Calculate optimal fetch ranges based on view type and current date
   */
  static getOptimalFetchRange(
    centerDate: Temporal.PlainDate,
    viewType: "day" | "week" | "month" | "agenda" | "weekday",
    prefetchDistance: number,
  ): CacheRange {
    let baseStart: Temporal.PlainDate;
    let baseEnd: Temporal.PlainDate;

    // 🚀 Optimize prefetch distance based on view type
    let adjustedPrefetch = prefetchDistance;

    switch (viewType) {
      case "day":
        baseStart = centerDate;
        baseEnd = centerDate;
        adjustedPrefetch = Math.min(prefetchDistance, 3); // Only 3 days prefetch
        break;

      case "week":
      case "weekday": {
        // Monday to Sunday
        baseStart = centerDate.subtract({ days: centerDate.dayOfWeek - 1 });
        baseEnd = baseStart.add({ days: 6 });
        adjustedPrefetch = Math.min(prefetchDistance, 7); // Only 1 week prefetch
        break;
      }

      case "month": {
        // 🚀 Use shared utility function for consistent month grid calculation
        const monthRange = getMonthViewDateRange(centerDate);
        baseStart = monthRange.start;
        baseEnd = monthRange.end;
        adjustedPrefetch = 0; // 🚀 NO prefetch for month view - too expensive
        break;
      }

      case "agenda":
        baseStart = centerDate;
        baseEnd = centerDate.add({ days: 30 });
        adjustedPrefetch = Math.min(prefetchDistance, 7); // Only 1 week prefetch
        break;

      default:
        baseStart = centerDate;
        baseEnd = centerDate;
        adjustedPrefetch = 3;
    }

    const range = {
      start: baseStart.subtract({ days: adjustedPrefetch }),
      end: baseEnd.add({ days: adjustedPrefetch }),
    };

    return range;
  }

  /**
   * Split large ranges into optimal batch sizes for fetching
   */
  static splitRangeIntoBatches(
    range: CacheRange,
    batchSize: number,
  ): CacheRange[] {
    const batches: CacheRange[] = [];
    let current = range.start;

    while (Temporal.PlainDate.compare(current, range.end) <= 0) {
      const batchEnd =
        Temporal.PlainDate.compare(
          current.add({ days: batchSize - 1 }),
          range.end,
        ) <= 0
          ? current.add({ days: batchSize - 1 })
          : range.end;

      batches.push({ start: current, end: batchEnd });
      current = batchEnd.add({ days: 1 });
    }

    return batches;
  }

  /**
   * Check if a range is already cached
   */
  static isRangeCached(range: CacheRange, memoryCache: MemoryCache): boolean {
    let current = range.start;
    while (Temporal.PlainDate.compare(current, range.end) <= 0) {
      const dayKey = getDayKeyFromDate(current);
      if (!memoryCache.has(dayKey)) {
        return false;
      }
      current = current.add({ days: 1 });
    }
    return true;
  }

  /**
   * Get missing date ranges that need to be fetched
   */
  static getMissingRanges(
    range: CacheRange,
    memoryCache: MemoryCache,
  ): CacheRange[] {
    const missing: CacheRange[] = [];
    let rangeStart: Temporal.PlainDate | null = null;
    let current = range.start;

    while (Temporal.PlainDate.compare(current, range.end) <= 0) {
      const dayKey = getDayKeyFromDate(current);
      const isCached = memoryCache.has(dayKey);

      if (!isCached && !rangeStart) {
        // Start of missing range
        rangeStart = current;
      } else if (isCached && rangeStart) {
        // End of missing range
        missing.push({ start: rangeStart, end: current.subtract({ days: 1 }) });
        rangeStart = null;
      }

      current = current.add({ days: 1 });
    }

    // Handle case where missing range extends to the end
    if (rangeStart) {
      missing.push({ start: rangeStart, end: range.end });
    }

    return missing;
  }
}

// ===============================
// MAIN CACHE MANAGER
// ===============================

export class CalendarCacheManager implements CacheEventEmitter {
  private memoryCache: MemoryCache;
  private prefetchQueue = new Set<string>();
  private activeRequests = new Map<string, Promise<CalendarSession[]>>();
  private listeners = new Set<CacheEventListener>();

  constructor(
    private queryClient: QueryClient,
    private config: CalendarCacheConfig = DEFAULT_CONFIG,
  ) {
    this.memoryCache = new MemoryCache(config);
  }

  // ===============================
  // EVENT EMITTER IMPLEMENTATION
  // ===============================

  /**
   * Subscribe to cache change events
   */
  on(listener: CacheEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Emit cache change events to all subscribers
   */
  emit(event: CacheChangeEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.warn("Cache event listener error:", error);
      }
    });
  }

  /**
   * Get sessions for a specific date (synchronous from memory cache)
   */
  getDaySessions(date: Temporal.PlainDate): LayoutCalendarSession[] {
    const dayKey = getDayKeyFromDate(date);
    return this.memoryCache.get(dayKey) || [];
  }

  /**
   * Check if data is available in cache
   */
  hasDaySessions(date: Temporal.PlainDate): boolean {
    const dayKey = getDayKeyFromDate(date);
    return this.memoryCache.has(dayKey);
  }

  /**
   * Get optimal batch size based on calendar view type
   */
  private getBatchSizeForView(viewType: string): number {
    switch (viewType) {
      case "month":
        return 42; // Larger batches for month view
      case "week":
      case "weekday":
        return 7; // Medium batches for week views
      case "day":
        return 3; // Smaller batches for day view
      case "agenda":
        return 7; // Medium-large for agenda view
      default:
        return this.config.batchSize;
    }
  }

  /**
   * Intelligent cache population based on view type
   * @param skipPrefetch - If true, only fetch exact view range (used by prefetchAdjacentData to prevent recursive prefetching)
   */
  async ensureDataForView(
    centerDate: Temporal.PlainDate,
    viewType: Parameters<typeof DateRangeCalculator.getOptimalFetchRange>[1],
    force = false,
    skipPrefetch = false,
  ): Promise<void> {
    // Use prefetchDistance for main calls, 0 for adjacent prefetch calls
    const prefetchDistance = skipPrefetch ? 0 : this.config.prefetchDistance;
    const range = DateRangeCalculator.getOptimalFetchRange(
      centerDate,
      viewType,
      prefetchDistance,
    );

    if (!force && DateRangeCalculator.isRangeCached(range, this.memoryCache)) {
      return; // Already cached
    }

    const missingRanges = DateRangeCalculator.getMissingRanges(
      range,
      this.memoryCache,
    );
    if (missingRanges.length === 0) {
      return;
    }

    // Get view-specific batch size
    const batchSize = this.getBatchSizeForView(viewType);

    // Fetch missing data in parallel batches
    await Promise.all(
      missingRanges.flatMap((missingRange) =>
        DateRangeCalculator.splitRangeIntoBatches(missingRange, batchSize).map(
          (batch) => this.fetchAndCacheRange(batch),
        ),
      ),
    );
  }

  /**
   * Background prefetching for predicted navigation
   */
  async prefetchAdjacentData(
    centerDate: Temporal.PlainDate,
    viewType: Parameters<typeof DateRangeCalculator.getOptimalFetchRange>[1],
  ): Promise<void> {
    // 🚀 Skip adjacent prefetching for month view to prevent over-fetching
    if (viewType === "month") {
      return;
    }

    const prefetchPromises: Promise<void>[] = [];

    // Prefetch previous period
    const prevDate = this.getPreviousViewDate(centerDate, viewType);
    const prevRange = DateRangeCalculator.getOptimalFetchRange(
      prevDate,
      viewType,
      0, // No additional prefetch for adjacent data
    );
    if (!DateRangeCalculator.isRangeCached(prevRange, this.memoryCache)) {
      prefetchPromises.push(
        this.ensureDataForView(prevDate, viewType, false, true),
      );
    }

    // Prefetch next period
    const nextDate = this.getNextViewDate(centerDate, viewType);
    const nextRange = DateRangeCalculator.getOptimalFetchRange(
      nextDate,
      viewType,
      0, // No additional prefetch for adjacent data
    );
    if (!DateRangeCalculator.isRangeCached(nextRange, this.memoryCache)) {
      prefetchPromises.push(
        this.ensureDataForView(nextDate, viewType, false, true),
      );
    }

    // Execute prefetches in background (don't await)
    Promise.all(prefetchPromises).catch(console.warn);
  }

  /**
   * Optimistic updates for CRUD operations
   */
  optimisticUpdate(
    date: Temporal.PlainDate,
    operation: "create" | "update" | "delete",
    session: Partial<CalendarSession> & { id: number },
  ): void {
    const dayKey = getDayKeyFromDate(date);
    const currentSessions = this.memoryCache.get(dayKey) || [];

    let updatedSessions: LayoutCalendarSession[];

    switch (operation) {
      case "create":
        updatedSessions = [
          ...currentSessions,
          session as LayoutCalendarSession,
        ];
        break;
      case "update":
        updatedSessions = currentSessions.map((s) =>
          s.id === session.id ? { ...s, ...session } : s,
        );
        break;
      case "delete":
        updatedSessions = currentSessions.filter((s) => s.id !== session.id);
        break;
    }

    // Re-process layout
    const processedSessions = groupOverlappingSessions(updatedSessions);
    this.memoryCache.set(dayKey, processedSessions);

    // Update query cache for consistency
    this.updateQueryCache(dayKey, processedSessions);

    // 🚀 Emit cache change event
    this.emit({
      type: "optimistic-update",
      date,
      sessions: processedSessions,
    });
  }

  /**
   * Cache invalidation for data consistency
   */
  invalidateRange(range: CacheRange): void {
    let current = range.start;
    while (Temporal.PlainDate.compare(current, range.end) <= 0) {
      const dayKey = getDayKeyFromDate(current);
      this.memoryCache.delete(dayKey);

      // Invalidate corresponding query cache entries
      this.queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey as string[];
          return (
            queryKey.includes("calendar-sessions") &&
            queryKey.includes(current.year.toString()) &&
            queryKey.includes(current.month.toString()) &&
            queryKey.includes(current.day.toString())
          );
        },
      });

      current = current.add({ days: 1 });
    }
  }

  /**
   * Get cache statistics for monitoring
   */
  getStats() {
    return {
      memory: this.memoryCache.getStats(),
      activeRequests: this.activeRequests.size,
      prefetchQueue: this.prefetchQueue.size,
    };
  }

  /**
   * Clear all caches
   */
  clear(): void {
    this.memoryCache.clear();
    this.prefetchQueue.clear();
    this.activeRequests.clear();

    // 🚀 Emit cache cleared event
    this.emit({
      type: "cache-cleared",
    });
  }

  // ===============================
  // PRIVATE METHODS
  // ===============================

  private async fetchAndCacheRange(range: CacheRange): Promise<void> {
    const rangeKey = `${getDayKeyFromDate(range.start)}-${getDayKeyFromDate(range.end)}`;

    // Prevent duplicate requests
    if (this.activeRequests.has(rangeKey)) {
      await this.activeRequests.get(rangeKey);
      return;
    }

    const promise = this.fetchRangeData(range);
    this.activeRequests.set(rangeKey, promise);

    try {
      const sessions = await promise;
      this.populateCacheFromRangeData(range, sessions);
    } finally {
      this.activeRequests.delete(rangeKey);
    }
  }

  private async fetchRangeData(range: CacheRange): Promise<CalendarSession[]> {
    const startDateTime = range.start.toPlainDateTime(
      new Temporal.PlainTime(0, 0, 0),
    );
    const endDateTime = range.end.toPlainDateTime(
      new Temporal.PlainTime(23, 59, 59),
    );

    const params = new URLSearchParams({
      startDate: startDateTime.toString(),
      endDate: endDateTime.toString(),
    });

    const response = await fetch(`/api/calendar/sessions?${params}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch calendar sessions: ${response.statusText}`,
      );
    }

    return response.json();
  }

  private populateCacheFromRangeData(
    range: CacheRange,
    sessions: CalendarSession[],
  ): void {
    // Process and organize sessions
    const layoutSessions = groupOverlappingSessions(sessions);
    const sessionsByDay = organizeSessionsByDay(layoutSessions);

    // Populate cache for each day in range
    let current = range.start;
    while (Temporal.PlainDate.compare(current, range.end) <= 0) {
      const dayKey = getDayKeyFromDate(current);
      const daySessions = sessionsByDay[dayKey] || [];

      this.memoryCache.set(dayKey, daySessions);
      this.updateQueryCache(dayKey, daySessions);

      // 🚀 Emit cache change event for each day
      this.emit({
        type: "day-updated",
        date: current,
        sessions: daySessions,
      });

      current = current.add({ days: 1 });
    }

    // 🚀 Emit range update event
    this.emit({
      type: "range-updated",
      dateRange: range,
    });
  }

  private updateQueryCache(
    dayKey: string,
    sessions: LayoutCalendarSession[],
  ): void {
    const [year, month, day] = dayKey.split("-").map(Number);
    const queryKey = ["calendar-day-sessions", year, month, day];
    this.queryClient.setQueryData(queryKey, sessions);
  }

  private getPreviousViewDate(
    date: Temporal.PlainDate,
    viewType: string,
  ): Temporal.PlainDate {
    switch (viewType) {
      case "day":
        return date.subtract({ days: 1 });
      case "week":
      case "weekday":
        return date.subtract({ weeks: 1 });
      case "month":
        return date.subtract({ months: 1 });
      case "agenda":
        return date.subtract({ days: 30 });
      default:
        return date.subtract({ days: 1 });
    }
  }

  private getNextViewDate(
    date: Temporal.PlainDate,
    viewType: string,
  ): Temporal.PlainDate {
    switch (viewType) {
      case "day":
        return date.add({ days: 1 });
      case "week":
      case "weekday":
        return date.add({ weeks: 1 });
      case "month":
        return date.add({ months: 1 });
      case "agenda":
        return date.add({ days: 30 });
      default:
        return date.add({ days: 1 });
    }
  }
}

// ===============================
// SINGLETON INSTANCE
// ===============================

let cacheManagerInstance: CalendarCacheManager | null = null;

export const createCalendarCacheManager = (
  queryClient: QueryClient,
  config?: Partial<CalendarCacheConfig>,
): CalendarCacheManager => {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new CalendarCacheManager(queryClient, {
      ...DEFAULT_CONFIG,
      ...config,
    });
  }
  return cacheManagerInstance;
};

export const getCalendarCacheManager = (): CalendarCacheManager => {
  if (!cacheManagerInstance) {
    throw new Error(
      "CalendarCacheManager not initialized. Call createCalendarCacheManager first.",
    );
  }
  return cacheManagerInstance;
};
