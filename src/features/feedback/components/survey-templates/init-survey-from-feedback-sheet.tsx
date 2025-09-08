"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  FolderLibraryIcon,
  Rocket01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useMemo, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import {
  RadioToggle,
  RadioToggleGroup,
} from "@/shared/components/ui/radio-toggle-group";
import { SearchField } from "@/shared/components/ui/search-field";
import { Sheet } from "@/shared/components/ui/sheet";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";

import { useInitSurvey } from "@/features/hub/hooks/feedback/use-init-survey";
import { getHubsByUserIdQueryOptions } from "@/features/hub/lib/hub-query-options";
import type { Hub } from "@/features/hub/types/hub.types";

interface InitSurveyFromFeedbackSheetProps {
  surveyTemplateId: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCancel?: () => void;
}

interface HubRadioItemProps {
  hub: Hub;
}

function HubRadioItem({ hub }: HubRadioItemProps) {
  const colorClasses = getCustomColorClasses(hub.color);

  return (
    <RadioToggle
      aria-label={`Select hub: ${hub.name}`}
      value={hub.id.toString()}
      className={cn("w-full h-12 justify-between")}
    >
      {({ isSelected }) => (
        <>
          <div className="flex items-center gap-2">
            <div
              className={cn("size-3 rounded-full shrink-0", colorClasses.dot)}
              title={`Color: ${hub.color}`}
            />
            <p className="font-medium text-sm truncate">{hub.name}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <p className="text-xs text-muted-fg">
              {hub.studentsCount} student{hub.studentsCount !== 1 ? "s" : ""}
            </p>
            {isSelected && (
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={20}
                className={colorClasses.text}
              />
            )}
          </div>
        </>
      )}
    </RadioToggle>
  );
}

export function InitSurveyFromFeedbackSheet({
  isOpen,
  onOpenChange,
  surveyTemplateId,
  onCancel,
}: InitSurveyFromFeedbackSheetProps) {
  const { data: hubs, isLoading } = useQuery({
    ...getHubsByUserIdQueryOptions,
  });
  const [selectedHubId, setSelectedHubId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const { mutate: initSurvey, isPending: isInitializing } = useInitSurvey({
    onSuccess: () => {
      handleClose();
    },
  });

  // Use deferred value for better performance during typing
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredHubs = useMemo(() => {
    if (!hubs) return [];
    if (!deferredSearchQuery.trim()) return hubs;

    return hubs.filter((hub) =>
      hub.name.toLowerCase().includes(deferredSearchQuery.toLowerCase()),
    );
  }, [hubs, deferredSearchQuery]);

  const handleClose = () => {
    setSelectedHubId("");
    setSearchQuery("");
    onCancel?.();
    onOpenChange(false);
  };

  const handleInitSurvey = async () => {
    if (!selectedHubId) return;

    initSurvey({
      hubId: Number(selectedHubId),
      surveyTemplateId,
    });
  };

  return (
    <Sheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <Sheet.Content
        side="right"
        className="w-[480px] max-w-[90vw]"
        closeButton={false}
      >
        <Sheet.Header className="border-b">
          <Sheet.Title className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Rocket01Icon}
              size={20}
              color="var(--color-primary)"
            />
            Initialize Survey
          </Sheet.Title>
          <Sheet.Description className="text-pretty">
            Initialize a new survey using this template for any of your courses
            below.
          </Sheet.Description>
        </Sheet.Header>

        <Sheet.Body className="p-[var(--gutter)] space-y-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={`hub-skeleton-${i}`}
                  className="h-16 rounded-lg"
                />
              ))}
            </div>
          ) : !hubs || hubs.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                <HugeiconsIcon
                  icon={FolderLibraryIcon}
                  size={24}
                  className="text-muted-fg"
                />
              </div>
              <Heading level={3} className="text-lg mb-2">
                No hubs available
              </Heading>
              <p className="text-muted-fg text-sm">
                Create a hub first to initialize surveys.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Heading level={3} className="text-base font-medium">
                  Available Hubs ({filteredHubs.length})
                </Heading>
              </div>

              <SearchField
                aria-label="Search hubs by name"
                placeholder="Search hubs by name..."
                value={searchQuery}
                onChange={setSearchQuery}
                className={{
                  primitive: "w-full",
                  fieldGroup: "h-12",
                }}
              />

              {filteredHubs.length === 0 ? (
                <p className="text-muted-fg text-sm w-full text-center py-6">
                  No hubs found matching "{deferredSearchQuery}"
                </p>
              ) : (
                <RadioToggleGroup
                  aria-label="Select hub"
                  value={selectedHubId}
                  onChange={setSelectedHubId}
                  orientation="vertical"
                  gap={2}
                  appearance="outline"
                  className={{
                    content: "w-full",
                  }}
                >
                  {filteredHubs.map((hub) => (
                    <HubRadioItem key={`hub-${hub.id}`} hub={hub} />
                  ))}
                </RadioToggleGroup>
              )}
            </div>
          )}
        </Sheet.Body>

        <Sheet.Footer className="border-t">
          <Button
            intent="outline"
            onPress={handleClose}
            isDisabled={isInitializing}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} data-slot="icon" />
            Cancel
          </Button>

          <Button
            intent="primary"
            onPress={handleInitSurvey}
            isDisabled={!selectedHubId || isInitializing}
          >
            {isInitializing && (
              <ProgressCircle
                isIndeterminate
                aria-label="Initializing survey..."
                className="size-4"
              />
            )}
            <HugeiconsIcon icon={Rocket01Icon} size={16} data-slot="icon" />
            Initialize Survey
          </Button>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  );
}
