import { Card } from "@/shared/components/ui/card";
import { Loader } from "@/shared/components/ui/loader";

import { SkeletonNoteCard } from "@/features/quick-notes/components/note-card/skeleton-note-card";
import { HubDashboardLayout } from "./hub-dashboard-layout";

export const HubLoading = () => {
  return (
    <HubDashboardLayout>
      <div className="flex-1 flex flex-col lg:flex-row p-0 sm:p-6 sm:pt-0 gap-6 h-full">
        <div className="bg-white sm:rounded-lg border flex-1 h-full">
          <div className="px-4 sm:px-6 flex items-center justify-center pt-20 flex-1">
            <Loader size="lg" intent="secondary" variant="spin" />
          </div>
        </div>
        <Card className="w-full shrink-0 lg:w-[350px] h-full hidden lg:flex">
          <Card.Header>
            <Card.Title>Quick Notes</Card.Title>
            <Card.Description>View the course notes</Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonNoteCard key={index} />
            ))}
          </Card.Content>
        </Card>
      </div>
    </HubDashboardLayout>
  );
};
