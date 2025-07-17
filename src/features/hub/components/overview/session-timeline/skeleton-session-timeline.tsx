import { Card } from "@/shared/components/ui/card";
import { Carousel } from "@/shared/components/ui/carousel";
import { Skeleton } from "@/shared/components/ui/skeleton";

const SkeletonSessionTimelineItem = () => {
  return (
    <Card
      className="relative w-full border-t-4 h-full border-muted bg-muted/20"
      spacing="sm"
    >
      <Card.Header className="flex items-center gap-3">
        <Skeleton className="shrink-0 size-8 rounded-full" />
        <div className="space-y-0.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      </Card.Header>

      <Card.Content className="pt-2 flex-1">
        <div className="space-y-3 h-full">
          <div className="flex items-center gap-2">
            <Skeleton className="w-1.5 h-1.5 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export const SkeletonSessionTimeline = () => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <Carousel.Content>
        {Array.from({ length: 4 }).map((_, index) => (
          <Carousel.Item
            key={`skeleton-session-timeline-item-${index}`}
            className="basis-1/2 @2xl:basis-1/3 @4xl:basis-1/4"
            spacing="md"
          >
            <SkeletonSessionTimelineItem />
          </Carousel.Item>
        ))}
      </Carousel.Content>

      <Carousel.Handler>
        <Carousel.Button segment="previous" />
        <Carousel.Button segment="next" />
      </Carousel.Handler>
    </Carousel>
  );
};
