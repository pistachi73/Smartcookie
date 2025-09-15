import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

export const SubscriptionCardSkeleton = () => {
  return (
    <div className="space-y-6">
      <Card
        className={cn(
          "@container",
          "[--card-spacing:--spacing(8)]",
          "shadow-md relative overflow-hidden",
        )}
      >
        {/* Top accent bar */}
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary w-full h-1" />

        <Card.Header className="gap-6 flex flex-col">
          <div className="space-y-8 shrink-0 w-full">
            {/* Title and description section */}
            <div className="space-y-2">
              <Card.Title className="flex flex-row gap-3 sm:text-2xl items-center font-bold">
                <Skeleton className="h-7 w-48" />
              </Card.Title>
              <Card.Description className="text-muted-fg text-base">
                <Skeleton className="h-4 w-48" />
              </Card.Description>
            </div>

            {/* Price and buttons section */}
            <div className="flex flex-col @2xl:flex-row items-start @2xl:items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-4 relative">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>

          {/* Features section */}
          <div className="space-y-4 w-full">
            <Skeleton className="h-5 w-48" />
            <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-x-20 gap-y-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={`feature-skeleton-${index}`}
                  className="flex flex-row items-center gap-3"
                >
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton
                    className={cn(
                      "h-4",
                      index === 0
                        ? "w-48"
                        : index === 1
                          ? "w-56"
                          : index === 2
                            ? "w-52"
                            : index === 3
                              ? "w-44"
                              : index === 4
                                ? "w-50"
                                : "w-40",
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </Card.Header>

        <Card.Content className="space-y-8">
          <div className="h-px bg-border" />

          {/* Upgrade section */}
          <div className="space-y-4">
            <div className="space-y-2 flex flex-row items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-9 w-32" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-5 w-64" />
              <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-3 w-full">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={`upgrade-feature-skeleton-${index}`}
                    className="flex flex-row items-center gap-3"
                  >
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton
                      className={cn(
                        "h-4",
                        index === 0
                          ? "w-44"
                          : index === 1
                            ? "w-52"
                            : index === 2
                              ? "w-48"
                              : "w-40",
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};
