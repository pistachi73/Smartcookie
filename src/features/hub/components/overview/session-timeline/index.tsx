import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { QueryError } from "@/shared/components/ui/query-error";

import { getInfiniteSessionsByHubIdQueryOptions } from "../../../lib/hub-sessions-query-options";
import { SessionTimelineCarrousel } from "./session-timeline-carrousel";
import { SkeletonSessionTimeline } from "./skeleton-session-timeline";

export const SessionTimeline = ({
  hubId,
  onGoToSessions,
}: {
  hubId: number;
  onGoToSessions: () => void;
}) => {
  const { data, isLoading, error, refetch, isRefetching } = useInfiniteQuery(
    getInfiniteSessionsByHubIdQueryOptions(hubId),
  );

  const allSessions = data?.pages.flatMap((page) => page.sessions) ?? [];

  if (isLoading) {
    return <SkeletonSessionTimeline />;
  }

  if (error) {
    return (
      <QueryError
        title="Failed to load sessions"
        message="We encountered an error while loading your data. Please try again."
        onRetry={refetch}
        isRetrying={isRefetching}
      />
    );
  }

  if (!data || data.pages.length === 0) {
    return (
      <Card className="border-dashed" spacing="md">
        <Card.Content className="text-center py-12">
          <HugeiconsIcon
            icon={Calendar01Icon}
            className="h-12 w-12 mx-auto text-muted-fg mb-4"
          />
          <h3 className="text-lg font-medium text-fg mb-2">
            No sessions found
          </h3>
          <p className="text-sm text-muted-fg">
            This hub doesn't have any sessions yet. Create your first session to
            get started.
          </p>
        </Card.Content>
      </Card>
    );
  }

  return (
    <div className="@container relative space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Heading level={3}>Session Timeline</Heading>
        <Button
          intent="plain"
          size="small"
          className="text-muted-fg hover:text-inherit"
          onPress={onGoToSessions}
        >
          View all
        </Button>
      </div>

      <SessionTimelineCarrousel
        sessions={allSessions}
        goToSessions={onGoToSessions}
      />
    </div>
  );
};
