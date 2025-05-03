"use client";

import { Link } from "@/shared/components/ui/link";
import { useParams } from "next/navigation";

import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";
import { cn } from "@/shared/lib/classes";
import type { getSurveysUseCase } from "../use-cases/surveys.use-case";

type SurveyListItemProps = {
  survey: Awaited<ReturnType<typeof getSurveysUseCase>>["surveys"][number];
};

export const SurveyListItem = ({ survey }: SurveyListItemProps) => {
  const params = useParams();
  const { createHrefWithParams } = useNavigateWithParams();

  const { surveyId } = params;

  const isActive = Number(surveyId) === survey.id;

  const href = createHrefWithParams(
    isActive ? "/portal/feedback" : `/portal/feedback/surveys/${survey.id}`,
  );

  return (
    <Link
      key={`survey-${survey.id}`}
      href={href}
      className={cn("relative flex flex-row gap-4 border-b p-5", {
        "bg-primary-tint": isActive,
        "before:absolute before:inset-0 before:z-10 before:w-[3px] before:h-full before:bg-primary":
          isActive,
      })}
    >
      <p className="tabular-nums">{survey.responsesCount}</p>
      <div className="space-y-2">
        <div className="space-y-1">
          <p className="font-medium text-sm ">{survey.title}</p>
          <p className="text-xs text-muted-fg">{survey.description}</p>
        </div>
      </div>
    </Link>
  );
};
