import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons-pro/core-stroke-rounded";

import { Card } from "@/shared/components/ui/card";

export const ViewMoreSessionsCard = ({
  onViewMore,
}: {
  onViewMore: () => void;
}) => (
  <Card
    className="relative w-full border-t-4 border-t-dashed border-t-border bg-muted/30 h-full cursor-pointer hover:bg-muted/50 transition-colors"
    spacing="sm"
    onClick={onViewMore}
  >
    <Card.Content className="flex flex-col items-center justify-center h-full py-8">
      <div className="flex items-center justify-center size-12 rounded-full bg-muted border-2 border-dashed border-border mb-4">
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          className="size-5 text-muted-fg"
        />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-fg">View More Sessions</p>
        <p className="text-xs text-muted-fg">See all your sessions</p>
      </div>
    </Card.Content>
  </Card>
);
