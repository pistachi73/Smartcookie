import { HugeiconsIcon } from "@hugeicons/react";
import {
  Analytics02Icon,
  ArrowDown01Icon,
  Delete01Icon,
  DeliveryView01Icon,
  Link02Icon,
  MoreVerticalIcon,
  UserMultipleIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/shared/components/ui/badge";
import { Button, buttonStyles } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { Menu } from "@/shared/components/ui/menu";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/classes";

import {
  type GetSurveysByHubIdQueryResponse,
  getSurveyResponsesBySurveyIdQueryOptions,
} from "../../lib/hub-surveys-query-options";
import { DeleteSurveyModal } from "./delete-survey-modal";
import { SurveyResponse } from "./survey-response";
import { SurveyNoResponses } from "./survey-response/survey-no-responses";

type SurveyListItemProps = {
  handleToggle: () => void;
  survey: GetSurveysByHubIdQueryResponse[number];
  hubId: number;
  selectedSurveyId: string | null;
};

export const SurveyListItem = ({
  handleToggle,
  survey,
  hubId,
  selectedSurveyId,
}: SurveyListItemProps) => {
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isOpen = selectedSurveyId === survey.id;

  const { data: surveyResponses, isLoading } = useQuery({
    ...getSurveyResponsesBySurveyIdQueryOptions(survey.id),
    enabled: isOpen && !!survey.id,
  });

  const prefetchSurveyResponses = useCallback(() => {
    queryClient.prefetchQuery({
      ...getSurveyResponsesBySurveyIdQueryOptions(survey.id),
      staleTime: 60000,
    });
  }, [queryClient, survey.id]);

  const copySurveyLink = useCallback(async () => {
    const surveyUrl = `${window.location.origin}/survey/${survey.id}`;
    try {
      await navigator.clipboard.writeText(surveyUrl);
      toast.success("Survey link copied to clipboard");
    } catch (err) {
      console.error("Failed to copy survey link:", err);
      toast.error("Failed to copy survey link");
    }
  }, [survey.id]);

  const completedSurveyResponses = survey.surveyResponses.filter(
    (response) => response.completed,
  );
  const totalResopnses = survey.surveyResponses.length;
  const completedPercentage =
    (completedSurveyResponses.length / totalResopnses) * 100;

  const canOpen = isOpen && !isLoading;

  return (
    <>
      <div
        key={`survey-${survey.id}`}
        className={cn(
          "border rounded-lg transition-opacity",
          selectedSurveyId && "opacity-70",
          isOpen && "shadow-md opacity-100 border-primary shadow-primary-tint",
        )}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleToggle();
            }
          }}
          className={cn(
            buttonStyles({ intent: "plain" }),
            "w-full group p-3 px-4 sm:p-3 h-auto flex  flex-1 gap-2 transition-all justify-between hover:bg-bg",
            canOpen && "bg-muted rounded-b-none",
          )}
          onMouseEnter={prefetchSurveyResponses}
          onFocus={prefetchSurveyResponses}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "aspect-square hidden sm:flex transition-colors flex-col items-center justify-center size-14 bg-bg dark:bg-overlay-highlight rounded-sm",
                isOpen && " dark:bg-overlay-elevated",
              )}
            >
              <p className="text-xs text-muted-fg">
                {format(survey.createdAt, "MMM")}
              </p>
              <p className="text-lg font-semibold tabular-nums">
                {format(survey.createdAt, "dd")}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="items-start">
                <Heading className="text-base sm:text-base text-left font-semibold first-letter:uppercase">
                  {survey.surveyTemplate.title}
                </Heading>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-3 items-center">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-fg">
                    <HugeiconsIcon icon={UserMultipleIcon} size={14} />
                    <span className="text-muted-fg">
                      <span className="font-semibold">
                        {completedSurveyResponses.length}
                      </span>{" "}
                      of <span className="font-semibold">{totalResopnses}</span>{" "}
                      responses
                    </span>
                  </div>
                  <Badge
                    intent={completedPercentage > 50 ? "success" : "warning"}
                    className="text-xs sm:text-sm"
                  >
                    <HugeiconsIcon icon={Analytics02Icon} size={14} />
                    {Math.round(completedPercentage)}%{" "}
                    <span className="hidden sm:inline">completion</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4 size-8 justify-center">
              {isLoading && isOpen ? (
                <ProgressCircle
                  isIndeterminate
                  aria-label="Loading response"
                  className="size-4"
                />
              ) : (
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={20}
                  className={cn(
                    "text-muted-fg transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              )}
            </div>
            <Menu>
              <Button
                intent="plain"
                shape="square"
                size="square-petite"
                className="size-8 data-pressed:opacity-100 transition-opacity group-hover:opacity-100"
              >
                <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
              </Button>
              <Menu.Content placement="bottom end">
                <Menu.Item
                  href={`/portal/feedback/survey-templates/${survey.surveyTemplate.id}`}
                >
                  <HugeiconsIcon
                    icon={DeliveryView01Icon}
                    size={16}
                    data-slot="icon"
                  />
                  <Menu.Label>View Survey Template</Menu.Label>
                </Menu.Item>
                <Menu.Item onAction={copySurveyLink}>
                  <HugeiconsIcon icon={Link02Icon} size={16} data-slot="icon" />
                  <Menu.Label>Copy Survey Link</Menu.Label>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Item
                  isDanger
                  className="gap-1"
                  onAction={() => setIsDeleteModalOpen(true)}
                >
                  <HugeiconsIcon
                    icon={Delete01Icon}
                    size={16}
                    data-slot="icon"
                  />
                  <Menu.Label>Delete Survey</Menu.Label>
                </Menu.Item>
              </Menu.Content>
            </Menu>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && !isLoading && (
            <m.div
              className="overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Separator />
              {surveyResponses?.length ? (
                <SurveyResponse
                  surveyId={survey.id}
                  surveyQuestions={survey.surveyTemplate.questions}
                />
              ) : (
                <SurveyNoResponses />
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <DeleteSurveyModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        survey={survey}
        hubId={hubId}
      />
    </>
  );
};
