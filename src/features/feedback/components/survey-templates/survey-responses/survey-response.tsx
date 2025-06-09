"use client";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/classes";
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  Clock01Icon,
} from "@hugeicons-pro/core-stroke-rounded";

import { surveyResponseAnswersQueryOptions } from "@/features/feedback/lib/survey-response-query-options";
import type { getSurveyTemplateResponsesUseCase } from "@/features/feedback/use-cases/survey-templates.use-case";
import { StudentProfile } from "@/shared/components/students/student-profile";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { Separator } from "@/shared/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AnimatePresence, m } from "motion/react";
import { SurveyResponseAnswers } from "./survey-response-answers";

type SurveyResponseProps = {
  surveyTemplateId: number;
  handleToggle: () => void;
  isOpen: boolean;
  response: Awaited<
    ReturnType<typeof getSurveyTemplateResponsesUseCase>
  >["responses"][number];
};

export const SurveyResponse = ({
  handleToggle,
  isOpen,
  response,
  surveyTemplateId,
}: SurveyResponseProps) => {
  const { isLoading } = useQuery({
    ...surveyResponseAnswersQueryOptions({
      surveyResponseId: response.id,
      surveyTemplateId,
    }),
    enabled: isOpen,
  });

  return (
    <div className=" border rounded-lg overflow-hidde">
      <Button
        onPress={handleToggle}
        intent="plain"
        className={cn(
          "group p-4 h-auto flex w-full  gap-2 transition-all",
          isOpen && "bg-muted rounded-b-none",
        )}
      >
        <div className="flex items-center justify-between w-full">
          <StudentProfile
            name={response.student.name}
            email={response.student.email}
            image={response.student.image}
          />

          <div className="flex items-center gap-4">
            <Separator orientation="vertical" className="h-8" />

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-fg">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={16}
                  className="text-muted-fg"
                />
                <span className="font-medium">
                  {format(new Date(response.completedAt || ""), "dd MMM yyyy")}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-fg">
                <HugeiconsIcon
                  icon={Clock01Icon}
                  size={16}
                  className="text-muted-fg"
                />
                <span className="font-medium">
                  {format(new Date(response.completedAt || ""), "h:mm a")}
                </span>
              </div>
            </div>

            {isLoading ? (
              <ProgressCircle
                isIndeterminate
                aria-label="Loading response"
                className="size-4"
              />
            ) : (
              <HugeiconsIcon
                icon={isOpen ? ArrowDown01Icon : ArrowRight01Icon}
                size={16}
                className="text-muted-fg transition-transform"
              />
            )}
          </div>
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && !isLoading && (
          <m.div
            className="overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Separator />
            <SurveyResponseAnswers
              surveyResponseId={response.id}
              surveyTemplateId={surveyTemplateId}
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
