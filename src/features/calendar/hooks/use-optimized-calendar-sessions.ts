import { getLocalTimeZone, today } from "@internationalized/date";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Temporal } from "temporal-polyfill";

import {
  type CacheChangeEvent,
  type CacheEventListener,
  type CalendarCacheConfig,
  createCalendarCacheManager,
  getCalendarCacheManager,
} from "../lib/calendar-cache";
import type { CalendarView } from "../types/calendar.types";

/**
 * High-performance calendar sessions hook with intelligent caching
 * and predictive prefetching based on view type and navigation patterns
 */

// ===============================
// CACHE SUBSCRIPTION HOOK
// ===============================

/**
 * Hook to subscribe to cache changes for specific dates
 * Triggers re-renders when cache data changes
 */
export const useCacheSubscription = (date: Temporal.PlainDate) => {
  const [cacheVersion, setCacheVersion] = useState(0);
  const cacheManager = getCalendarCacheManager();

  useEffect(() => {
    const listener: CacheEventListener = (event: CacheChangeEvent) => {
      // Check if this event affects our date
      const isRelevant =
        event.type === "cache-cleared" ||
        (event.date && Temporal.PlainDate.compare(event.date, date) === 0) ||
        (event.dateRange &&
          Temporal.PlainDate.compare(date, event.dateRange.start) >= 0 &&
          Temporal.PlainDate.compare(date, event.dateRange.end) <= 0);

      if (isRelevant) {
        // Force re-render by incrementing version
        setCacheVersion((prev) => prev + 1);
      }
    };

    // Subscribe to cache changes
    const unsubscribe = cacheManager.on(listener);

    return unsubscribe;
  }, [date, cacheManager]);

  return cacheVersion;
};

export interface UseOptimizedCalendarSessionsOptions {
  cacheConfig?: Partial<CalendarCacheConfig>;
  viewType: CalendarView;
  date: Temporal.PlainDate;
  enablePrefetching?: boolean;
  enableOptimisticUpdates?: boolean;
}

const DEFAULT_OPTIONS: UseOptimizedCalendarSessionsOptions = {
  enablePrefetching: true,
  enableOptimisticUpdates: true,
  viewType: "week",
  date: Temporal.PlainDate.from(today(getLocalTimeZone()).toString()),
};

// ===============================
// QUERY KEYS & OPTIONS
// ===============================

const createQueryKey = (
  viewType: CalendarView,
  date: Temporal.PlainDate,
  version = 1,
) =>
  [
    "calendar-sessions-optimized",
    viewType,
    date.year,
    date.month,
    date.day,
    version,
  ] as const;

// ===============================
// MAIN HOOK
// ===============================

export const useOptimizedCalendarSessions = (
  options: UseOptimizedCalendarSessionsOptions = DEFAULT_OPTIONS,
) => {
  const { viewType, date, enablePrefetching, cacheConfig } = options;
  const queryClient = useQueryClient();

  // Initialize cache manager (singleton)
  const cacheManager = createCalendarCacheManager(queryClient, cacheConfig);

  // Create stable query key
  const queryKey = useMemo(
    () => createQueryKey(viewType, date),
    [viewType, date],
  );

  // ===============================
  // MAIN QUERY WITH CACHE INTEGRATION
  // ===============================

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      await cacheManager.ensureDataForView(date, viewType);
      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // Enable background refetch for data freshness
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });

  // ===============================
  // PREFETCHING EFFECTS
  // ===============================

  useEffect(() => {
    if (!enablePrefetching || query.isLoading) return;

    const prefetchTimer = setTimeout(() => {
      cacheManager.prefetchAdjacentData(date, viewType);
    }, 100); // Small delay to prioritize current view

    return () => clearTimeout(prefetchTimer);
  }, [date, viewType, enablePrefetching, query.isLoading, cacheManager]);

  return;
};

// ===============================
// DAY-SPECIFIC HOOK (FOR INDIVIDUAL DAY COMPONENTS)
// ===============================

export const useOptimizedDaySessions = (date: Temporal.PlainDate) => {
  const cacheManager = getCalendarCacheManager();

  // 🚀 Subscribe to cache changes for this date
  const cacheVersion = useCacheSubscription(date);

  // Get sessions directly from memory cache (synchronous)
  // Now includes cacheVersion in dependency to trigger re-renders on cache changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: We need to force rerender on cache changes
  const sessions = useMemo(() => {
    return cacheManager.getDaySessions(date);
  }, [date, cacheManager, cacheVersion]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: We need to force rerender on cache changes
  const isLoading = useMemo(() => {
    return !cacheManager.hasDaySessions(date);
  }, [date, cacheManager, cacheVersion]);

  return {
    sessions,
    isLoading,
    isEmpty: sessions.length === 0,
  };
};

// ===============================
// CACHE WARMING UTILITY
// ===============================

export const warmCalendarCache = async (
  date: Temporal.PlainDate,
  views: CalendarView[] = ["day", "week", "month"],
): Promise<void> => {
  const cacheManager = getCalendarCacheManager();

  await Promise.all(
    views.map(
      (view) => cacheManager.ensureDataForView(date, view, true), // force refresh
    ),
  );
};
