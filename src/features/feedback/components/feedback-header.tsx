"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Comment01Icon } from "@hugeicons-pro/core-solid-rounded";
import { AddIcon } from "@hugeicons-pro/core-stroke-rounded";

import { buttonStyles } from "@/shared/components/ui/button";
import { Link } from "@/shared/components/ui/link";
import { PageHeader } from "@/shared/components/layout/page-header";
import { useNavigateWithParams } from "@/shared/hooks/use-navigate-with-params";

export const FeedbackHeader = () => {
  const { createHrefWithParams } = useNavigateWithParams();

  const addQuestionHref = createHrefWithParams(
    "/portal/feedback/questions/new",
  );
  const createSurveyHref = createHrefWithParams(
    "/portal/feedback/survey-templates/new",
  );

  return (
    <PageHeader
      title="Feedback"
      subTitle="Manage your feedback"
      icon={Comment01Icon}
      className={{
        container: "bg-bg",
      }}
      actions={
        <>
          <Link
            href={addQuestionHref}
            className={buttonStyles({
              intent: "outline",
            })}
          >
            <HugeiconsIcon icon={AddIcon} size={16} data-slot="icon" />
            Create Question
          </Link>
          <Link href={createSurveyHref} className={buttonStyles()}>
            <HugeiconsIcon icon={AddIcon} size={16} data-slot="icon" />
            Create Survey
          </Link>
        </>
      }
    />
  );
};
