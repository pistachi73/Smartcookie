"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Temporal } from "temporal-polyfill";

import { warmCalendarCache } from "../hooks/use-optimized-calendar-sessions";
import {
  type CalendarCacheConfig,
  type CalendarCacheManager,
  createCalendarCacheManager,
} from "../lib/calendar-cache";

/**
 * Optimized Calendar Provider that initializes and manages
 * the high-performance caching and synchronization systems
 */

// ===============================
// CONTEXT & TYPES
// ===============================

interface OptimizedCalendarContextValue {
  cacheManager: CalendarCacheManager;
  isInitialized: boolean;
  getCacheStats: () => ReturnType<CalendarCacheManager["getStats"]>;
  forceRefresh: () => Promise<void>;
  warmCache: () => Promise<void>;
}

const OptimizedCalendarContext =
  createContext<OptimizedCalendarContextValue | null>(null);

// ===============================
// CONFIGURATION
// ===============================

const DEFAULT_CACHE_CONFIG: Partial<CalendarCacheConfig> = {
  maxMemoryCacheSize: 150, // 150 days worth of data
  maxMemoryCacheAge: 20 * 60 * 1000, // 20 minutes
  prefetchDistance: 21, // 3 weeks ahead/behind
  batchSize: 7, // 1 week batches
};

// ===============================
// PROVIDER COMPONENT
// ===============================

interface OptimizedCalendarProviderProps {
  children: ReactNode;
  cacheConfig?: Partial<CalendarCacheConfig>;
  enablePerformanceMonitoring?: boolean;
  autoWarmCache?: boolean;
}

export const OptimizedCalendarProvider = ({
  children,
  cacheConfig = {},
  enablePerformanceMonitoring = process.env.NODE_ENV === "development",
}: OptimizedCalendarProviderProps) => {
  const queryClient = useQueryClient();

  const managersRef = useRef<{
    cacheManager: CalendarCacheManager;
  } | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize managers
  useEffect(() => {
    if (!managersRef.current) {
      console.log("🚀 Initializing OptimizedCalendarProvider managers...");

      const cacheManager = createCalendarCacheManager(queryClient, {
        ...DEFAULT_CACHE_CONFIG,
        ...cacheConfig,
      });

      managersRef.current = { cacheManager };
      setIsInitialized(true);

      console.log(
        "✅ OptimizedCalendarProvider managers initialized successfully",
      );

      if (enablePerformanceMonitoring) {
        console.log("📊 Optimized Calendar System initialized:", {
          cacheConfig: { ...DEFAULT_CACHE_CONFIG, ...cacheConfig },
        });
      }
    }
  }, [queryClient, cacheConfig, enablePerformanceMonitoring]);

  // Performance monitoring
  useEffect(() => {
    if (!enablePerformanceMonitoring || !managersRef.current) return;

    const interval = setInterval(() => {
      const cacheStats = managersRef.current!.cacheManager.getStats();

      console.log("📈 Performance Stats:", {
        cache: cacheStats,
        memory: {
          used:
            Math.round(
              (performance as any)?.memory?.usedJSHeapSize / 1024 / 1024,
            ) || "N/A",
          total:
            Math.round(
              (performance as any)?.memory?.totalJSHeapSize / 1024 / 1024,
            ) || "N/A",
          limit:
            Math.round(
              (performance as any)?.memory?.jsHeapSizeLimit / 1024 / 1024,
            ) || "N/A",
        },
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [enablePerformanceMonitoring]);

  // Context value
  const contextValue: OptimizedCalendarContextValue = {
    cacheManager: managersRef.current?.cacheManager!,
    isInitialized,

    getCacheStats: () =>
      managersRef.current?.cacheManager.getStats() || {
        memory: { size: 0, totalSessions: 0, avgHitCount: 0, oldestEntry: 0 },
        activeRequests: 0,
        prefetchQueue: 0,
      },

    forceRefresh: async () => {
      if (managersRef.current) {
        managersRef.current.cacheManager.clear();
        // Individual components will re-fetch data as needed
      }
    },

    warmCache: async () => {
      if (managersRef.current) {
        // Basic cache warming without calendar store dependency
        const today = Temporal.Now.plainDateISO();
        await warmCalendarCache(today, ["month"]);
      }
    },
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (managersRef.current) {
        managersRef.current.cacheManager.clear();
      }
    };
  }, []);

  return (
    <OptimizedCalendarContext.Provider value={contextValue}>
      {children}
    </OptimizedCalendarContext.Provider>
  );
};

// ===============================
// CONTEXT HOOK
// ===============================

export const useOptimizedCalendar = (): OptimizedCalendarContextValue => {
  const context = useContext(OptimizedCalendarContext);

  if (!context) {
    throw new Error(
      "useOptimizedCalendar must be used within an OptimizedCalendarProvider",
    );
  }

  return context;
};

// ===============================
// PERFORMANCE DEBUGGING HOOKS
// ===============================

export const useCalendarPerformance = () => {
  const { getCacheStats } = useOptimizedCalendar();

  return {
    cacheStats: getCacheStats(),

    // Performance utilities
    measureRenderTime: (componentName: string) => {
      const start = performance.now();
      return () => {
        const end = performance.now();
        console.log(
          `⏱️ ${componentName} render time: ${(end - start).toFixed(2)}ms`,
        );
      };
    },

    // Memory monitoring
    getMemoryUsage: () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        return {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
        };
      }
      return null;
    },
  };
};

// ===============================
// CACHE CONTROL HOOKS
// ===============================

export const useCalendarCacheControl = () => {
  const { cacheManager, forceRefresh, warmCache } = useOptimizedCalendar();

  return {
    // Cache operations
    forceRefresh,
    warmCache,
    clearCache: () => cacheManager.clear(),

    // Cache inspection
    inspectCache: (date: Temporal.PlainDate) => ({
      hasSessions: cacheManager.hasDaySessions(date),
      sessions: cacheManager.getDaySessions(date),
    }),

    // Preload specific dates
    preloadDates: async (dates: Temporal.PlainDate[]) => {
      for (const date of dates) {
        await cacheManager.ensureDataForView(date, "day");
      }
    },
  };
};
