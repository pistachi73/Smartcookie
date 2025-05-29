"use client";

import { Link } from "@/shared/components/ui/link";
import { useParams } from "next/navigation";

import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";
import { cn } from "@/shared/lib/classes";
import type { getSurveysUseCase } from "../../use-cases/surveys.use-case";

import { Button } from "@/shared/components/ui/button";
import { Menu } from "@/shared/components/ui/menu";
import {
  BubbleChatEditIcon,
  Delete01Icon,
  MoreVerticalIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { DeleteSurveyModal } from "./delete-survey-modal";

type SurveyListItemProps = {
  survey: Awaited<ReturnType<typeof getSurveysUseCase>>["surveys"][number];
};

export const SurveyListItem = ({ survey }: SurveyListItemProps) => {
  const params = useParams();
  const { createHrefWithParams } = useNavigateWithParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { surveyId } = params;

  const isActive = Number(surveyId) === survey.id;

  const href = createHrefWithParams(
    isActive ? "/portal/feedback" : `/portal/feedback/surveys/${survey.id}`,
  );

  return (
    <>
      <div
        className={cn(
          "relative flex w-full items-center gap-4 border-b p-4 group transition-colors hover:bg-muted",
          {
            "bg-primary-tint hover:bg-primary-tint": isActive,
            "before:absolute before:inset-0 before:z-10 before:w-[3px] before:h-full before:bg-primary":
              isActive,
          },
        )}
      >
        <Link href={href} className="flex-1 flex items-center gap-4">
          <p className="flex-shrink-0 size-8 flex items-center justify-center  text-sm font-medium tabular-nums bg-muted rounded-sm">
            {survey.totalResponses}
          </p>

          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-semibold text-sm text-foreground truncate">
              {survey.title}
            </h3>
            {survey.description && (
              <p className="text-xs text-muted-fg line-clamp-2">
                {survey.description}
              </p>
            )}
          </div>
        </Link>

        <div className="flex-shrink-0">
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
              <Menu.Item className="gap-1">
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

      <DeleteSurveyModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        survey={survey}
      />
    </>
  );
};
