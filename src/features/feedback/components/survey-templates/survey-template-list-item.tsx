"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatEditIcon,
  Delete01Icon,
  MoreVerticalIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Link } from "@/shared/components/ui/link";
import { Menu } from "@/shared/components/ui/menu";
import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";
import { cn } from "@/shared/lib/classes";

import type { getSurveyTemplates } from "@/data-access/survey-templates/queries";
import { DeleteSurveyTemplateModal } from "./delete-survey-template-modal";

type SurveyTemplateListItemProps = {
  surveyTemplate: Awaited<
    ReturnType<typeof getSurveyTemplates>
  >["surveyTemplates"][number];
};

export const SurveyTemplateListItem = ({
  surveyTemplate,
}: SurveyTemplateListItemProps) => {
  const params = useParams();
  const { createHrefWithParams } = useNavigateWithParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { surveyId } = params;

  const isActive = Number(surveyId) === surveyTemplate.id;

  const viewHref = createHrefWithParams(
    `/portal/feedback/survey-templates/${surveyTemplate.id}`,
  );
  const editHref = createHrefWithParams(
    `/portal/feedback/survey-templates/${surveyTemplate.id}/edit`,
  );

  return (
    <>
      <div
        className={cn(
          "relative flex w-full items-center gap-4 border-b  group transition-colors hover:bg-muted pr-4",
          {
            "bg-primary-tint hover:bg-primary-tint": isActive,
            "before:absolute before:inset-0 before:z-10 before:w-[3px] before:h-full before:bg-primary":
              isActive,
          },
        )}
        data-selected={isActive}
        data-testid="survey-list-item"
      >
        <Link
          href={viewHref}
          className="flex-1 flex items-center gap-4 p-4 pr-0"
        >
          <p className="shrink-0 size-8 flex items-center justify-center  text-sm font-medium tabular-nums bg-muted rounded-sm">
            {surveyTemplate.totalResponses}
          </p>

          <div className="space-y-0.5">
            <p className="font-medium text-sm text-balance">
              {surveyTemplate.title}
            </p>
            {surveyTemplate.description && (
              <p className="text-xs text-muted-fg line-clamp-2">
                {surveyTemplate.description}
              </p>
            )}
          </div>
        </Link>

        <div className="shrink-0">
          <Menu>
            <Button
              intent="plain"
              shape="square"
              size="square-petite"
              className="sm:opacity-0 group-hover:opacity-100 size-8 data-pressed:opacity-100 transition-opacity"
            >
              <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
            </Button>
            <Menu.Content placement="bottom end">
              <Menu.Item className="gap-1" href={editHref}>
                <HugeiconsIcon
                  icon={BubbleChatEditIcon}
                  size={16}
                  data-slot="icon"
                />
                <Menu.Label>Edit</Menu.Label>
              </Menu.Item>
              <Menu.Separator />
              <Menu.Item
                isDanger
                className="gap-1"
                onAction={() => setIsDeleteModalOpen(true)}
              >
                <HugeiconsIcon icon={Delete01Icon} size={16} data-slot="icon" />
                <Menu.Label>Delete</Menu.Label>
              </Menu.Item>
            </Menu.Content>
          </Menu>
        </div>
      </div>

      <DeleteSurveyTemplateModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        surveyTemplate={{
          id: surveyTemplate.id,
          title: surveyTemplate.title,
          description: surveyTemplate.description,
        }}
      />
    </>
  );
};
