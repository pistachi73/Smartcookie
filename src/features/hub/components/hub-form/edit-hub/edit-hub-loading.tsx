import { HugeiconsIcon } from "@hugeicons/react";
import { FolderDetailsIcon } from "@hugeicons-pro/core-solid-rounded";

import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

import { HubFormLayout } from "../hub-form-layout";
import { EditHubFormSkeleton } from "./edit-hub-form-skeleton";

export const EditHubLoading = () => {
  return (
    <HubFormLayout
      header="Edit course"
      subHeader="Edit your course with basic information. You can add students and sessions later."
    >
      <Card className="w-full bg-overlay">
        <Card.Header className="flex flex-row items-center gap-3">
          <div className="size-12 rounded-xl bg-primary-tint flex items-center justify-center">
            <HugeiconsIcon
              icon={FolderDetailsIcon}
              size={18}
              className="text-primary"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <Card.Title className="text-xl font-semibold">
              Course Information
            </Card.Title>
            <Card.Description>
              Let's start with the basic information about your course.
            </Card.Description>
          </div>
        </Card.Header>
        <Separator />
        <Card.Content className="space-y-4">
          <EditHubFormSkeleton />
        </Card.Content>
      </Card>
    </HubFormLayout>
  );
};
