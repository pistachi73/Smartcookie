"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { useEffect, useState } from "react";

interface StoreLoadingProps {
  /**
   * Whether the store is hydrated
   */
  isHydrated: boolean;
  /**
   * Content to render when store is hydrated
   */
  children: React.ReactNode;
  /**
   * Delay before showing loading state (ms)
   * @default 200
   */
  delay?: number;
  /**
   * Minimum time to show loading state (ms)
   * @default 500
   */
  minDuration?: number;
  /**
   * Custom className for the loading container
   */
  className?: string;
  /**
   * Custom fallback component to render while loading
   * If not provided, the default skeleton will be used
   */
  fallback?: React.ReactNode;
}

export function StoreLoading({
  isHydrated,
  children,
  delay = 200,
  minDuration = 500,
  className = "",
  fallback,
}: StoreLoadingProps) {
  const [showLoading, setShowLoading] = useState(false);
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    // Only show loading indicator after a delay to prevent flashes
    const delayTimer = setTimeout(() => {
      if (!isHydrated) {
        setShowLoading(true);
      }
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [isHydrated, delay]);

  useEffect(() => {
    if (isHydrated) {
      // Ensure loading state shows for at least minDuration
      const startTime = Date.now();
      const elapsedTime = showLoading ? Date.now() - startTime : minDuration;
      const remainingTime = Math.max(0, minDuration - elapsedTime);

      const timer = setTimeout(() => {
        setCanRender(true);
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [isHydrated, minDuration, showLoading]);

  if (isHydrated && canRender) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div
      className={`min-h-0 h-full flex bg-overlay w-full overflow-hidden ${className}`}
    >
      {/* Sidebar skeleton soft */}
      <div className="w-64 border-r border-border flex-col p-4 space-y-5 hidden md:flex">
        {/* Sidebar header */}
        <div className="flex items-center justify-between">
          <Skeleton soft className="h-7 w-32" />
          <Skeleton soft className="h-7 w-7 rounded-md" />
        </div>

        {/* Navigation groups */}
        <div className="space-y-4">
          <div>
            <Skeleton soft className="h-5 w-24 mb-2" />
            <div className="space-y-2 pl-2">
              <div className="flex items-center space-x-2">
                <Skeleton soft className="h-4 w-4 rounded-sm" />
                <Skeleton soft className="h-5 w-28" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton soft className="h-4 w-4 rounded-sm" />
                <Skeleton soft className="h-5 w-20" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton soft className="h-4 w-4 rounded-sm" />
                <Skeleton soft className="h-5 w-24" />
              </div>
            </div>
          </div>

          <div>
            <Skeleton soft className="h-5 w-20 mb-2" />
            <div className="space-y-2 pl-2">
              <div className="flex items-center space-x-2">
                <Skeleton soft className="h-4 w-4 rounded-sm" />
                <Skeleton soft className="h-5 w-32" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton soft className="h-4 w-4 rounded-sm" />
                <Skeleton soft className="h-5 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar footer */}
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <Skeleton soft className="h-9 w-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton soft className="h-4 w-20" />
              <Skeleton soft className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content skeleton soft */}
      <div className="flex-1 p-4 overflow-auto">
        {/* Filter/search bar */}
        <div className="flex flex-wrap gap-3 justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Skeleton soft className="h-10 w-64" />
            <Skeleton soft className="h-10 w-10 rounded-md" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton soft className="h-10 w-10 rounded-md" />
            <Skeleton soft className="h-10 w-24 rounded-md" />
          </div>
        </div>

        {/* Content grid with varied cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => {
            // Add some variation to the cards
            const isHighlighted = i === 0;
            const hasFooter = i % 2 === 0;
            const hasImage = i % 3 === 0;

            return (
              <div key={i} className="border rounded-md p-4 space-y-3">
                {hasImage && (
                  <Skeleton soft className="h-32 w-full rounded-md mb-3" />
                )}

                <div className="flex justify-between items-start">
                  <Skeleton soft className="h-6 w-3/4" />
                  <Skeleton soft className="h-6 w-6 rounded-full" />
                </div>

                <Skeleton soft className="h-4 w-full" />
                <Skeleton soft className="h-4 w-full" />
                <Skeleton soft className="h-4 w-1/2" />

                {hasFooter && (
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-border">
                    <div className="flex -space-x-2">
                      <Skeleton
                        soft
                        className="h-8 w-8 rounded-full border-2 border-background"
                      />
                      <Skeleton
                        soft
                        className="h-8 w-8 rounded-full border-2 border-background"
                      />
                    </div>
                    <Skeleton soft className="h-8 w-16 rounded-md" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
          <Skeleton soft className="h-5 w-32" />
          <div className="flex space-x-1">
            <Skeleton soft className="h-8 w-8 rounded-md" />
            <Skeleton soft className="h-8 w-8 rounded-md" />
            <Skeleton soft className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
