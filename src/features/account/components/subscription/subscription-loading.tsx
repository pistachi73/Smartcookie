import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const SubscriptionLoading = () => {
  return (
    <div className="space-y-6">
      <Card className="shadow-md relative overflow-hidden">
        {/* Top accent bar */}
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary w-full h-1" />

        <Card.Header>
          <Card.Title className="flex flex-row gap-2 text-xl items-center">
            <Skeleton className="h-6 w-24" />
          </Card.Title>
          <Card.Description>
            <Skeleton className="h-4 w-64" />
          </Card.Description>
        </Card.Header>

        <Card.Content className="space-y-6">
          {/* Upgrade button skeleton */}
          <Skeleton className="h-12 w-full rounded-lg" />

          <div className="space-y-4">
            {/* "With Pro plan you get:" text skeleton */}
            <Skeleton className="h-5 w-48" />

            {/* Feature list skeleton - 6 items to match memberChecks */}
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }, (_, index) => index).map((index) => (
                <div
                  key={`feature-skeleton-${index}`}
                  className="flex flex-row items-center gap-3"
                >
                  {/* Icon skeleton */}
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  {/* Feature text skeleton with varying widths */}
                  <Skeleton
                    className={`h-4 ${
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
                                : "w-40"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};
