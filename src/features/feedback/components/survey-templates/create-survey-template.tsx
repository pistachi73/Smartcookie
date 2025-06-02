"use client";

import { Link } from "@/shared/components/ui/link";
import { useNavigateWithParams } from "@/shared/hooks/use-navigate-with-params";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { SurveyTemplateForm } from "./survey-template-form";

export const CreateSurvey = () => {
  const { createHrefWithParams } = useNavigateWithParams();
  const backHref = createHrefWithParams("/portal/feedback");

  return (
    <div className="space-y-10">
      <Link
        intent="secondary"
        href={backHref}
        className="flex items-center gap-1.5 text-sm"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={18} data-slot="icon" />
        Back
      </Link>

      <SurveyTemplateForm />
    </div>
  );
};
