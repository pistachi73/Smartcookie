"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  NewsIcon,
  Rocket01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Button, buttonStyles } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import {
  RadioToggle,
  RadioToggleGroup,
} from "@/shared/components/ui/radio-toggle-group";
import { SearchField } from "@/shared/components/ui/search-field";
import { Sheet } from "@/shared/components/ui/sheet";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";

import {
  type GetSurveyTemplatesQueryResponse,
  getSurveyTemplatesQueryOptions,
} from "@/features/feedback/lib/survey-template-query-options";
import { useInitSurvey } from "../../hooks/feedback/use-init-survey";

interface InitSurveyFromHubSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  hubId: number;
  hubName: string;
  onInitSurvey?: (surveyTemplateId: number, hubId: number) => void;
  onCancel?: () => void;
}

interface SurveyTemplateRadioItemProps {
  template: GetSurveyTemplatesQueryResponse["surveyTemplates"][number];
}

function SurveyTemplateRadioItem({ template }: SurveyTemplateRadioItemProps) {
  return (
    <RadioToggle
      aria-label={template.title}
      value={template.id.toString()}
      className="w-full h-auto p-4 py-3 justify-between gap-4"
    >
      {({ isSelected }) => (
        <>
          <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
            <div className="w-full">
              <p className="font-medium text-base truncate first-letter:uppercase">
                {template.title}
              </p>
            </div>
            {template.description && (
              <p className="text-xs text-muted-fg line-clamp-2">
                {template.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isSelected && (
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={16}
                className="text-primary"
              />
            )}
          </div>
        </>
      )}
    </RadioToggle>
  );
}

export function InitSurveyFromHubSheet({
  isOpen,
  onOpenChange,
  hubId,
  hubName,
  onCancel,
}: InitSurveyFromHubSheetProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  const { data, isFetching } = useQuery({
    ...getSurveyTemplatesQueryOptions({
      q: debouncedSearchQuery.trim(),
    }),
    enabled: isOpen,
  });

  const { mutate: initSurvey, isPending: isInitializing } = useInitSurvey({
    onSuccess: () => {
      handleClose();
    },
  });

  const handleClose = () => {
    setSelectedTemplateId("");
    setSearchQuery("");
    onCancel?.();
    onOpenChange(false);
  };

  const handleInitSurvey = async () => {
    if (!selectedTemplateId) return;

    initSurvey({
      hubId,
      surveyTemplateId: Number(selectedTemplateId),
    });
  };

  return (
    <Sheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <Sheet.Content side="right" className="w-[480px] max-w-[90vw]">
        <Sheet.Header className="border-b">
          <Sheet.Title className="flex items-start gap-2">
            <HugeiconsIcon
              icon={Rocket01Icon}
              size={20}
              color="var(--color-primary)"
              className="shrink-0 h-7"
            />
            Initialize Survey for {hubName}
          </Sheet.Title>
          <Sheet.Description className="text-pretty">
            Select a survey template to create a new survey for this course.
          </Sheet.Description>
        </Sheet.Header>

        <Sheet.Body className="p-6 space-y-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <Heading level={3} className="text-base font-medium">
                Available Templates ({data?.totalCount})
              </Heading>
              <SearchField
                placeholder="Search survey templates by name or description..."
                value={searchQuery}
                onChange={setSearchQuery}
                className={{
                  primitive: "w-full",
                  fieldGroup: "h-12",
                }}
              />
            </div>

            {isFetching ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    key={`template-skeleton-${i}`}
                    className="h-16 rounded-lg"
                  />
                ))}
              </div>
            ) : data?.totalCount === 0 && !debouncedSearchQuery ? (
              <div className="py-8 flex flex-col items-center gap-6 border border-dashed rounded-lg">
                <div className="space-y-3 flex flex-col items-center">
                  <HugeiconsIcon
                    icon={NewsIcon}
                    size={24}
                    className="text-muted-fg"
                  />
                  <div className="space-y-1">
                    <Heading level={3}>No survey templates available</Heading>
                    <p className="text-muted-fg text-sm">
                      Create a survey template first to initialize surveys.
                    </p>
                  </div>
                </div>
                <Link
                  href="/portal/feedback/survey-templates/new"
                  intent="primary"
                  className={buttonStyles()}
                >
                  <HugeiconsIcon icon={Add01Icon} size={16} data-slot="icon" />
                  Create Survey Template
                </Link>
              </div>
            ) : data?.surveyTemplates.length === 0 ? (
              <p className="text-muted-fg text-sm w-full text-center py-6">
                No survey templates found matching "{debouncedSearchQuery}"
              </p>
            ) : (
              <div className="space-y-3">
                {!debouncedSearchQuery.trim() && (
                  <p className="text-muted-fg text-sm w-full">
                    Recently viewed survey templates
                  </p>
                )}
                <RadioToggleGroup
                  aria-label="Survey data"
                  value={selectedTemplateId}
                  onChange={setSelectedTemplateId}
                  orientation="vertical"
                  gap={2}
                  appearance="outline"
                  className={{
                    content: "w-full",
                  }}
                >
                  {data?.surveyTemplates.map((template) => (
                    <SurveyTemplateRadioItem
                      key={`template-${template.id}`}
                      template={template}
                    />
                  ))}
                </RadioToggleGroup>
              </div>
            )}
          </div>
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
            isDisabled={!selectedTemplateId || isInitializing}
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
