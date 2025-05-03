"use client";

import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/classes";
import type { FolderDetailsIcon } from "@hugeicons-pro/core-solid-rounded";
import { Tick01Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "react-aria-components";

type MultistepFormProgressProps = {
  totalSteps: number;
  currentStep: number;
  steps: { id: number; name: string; icon: typeof FolderDetailsIcon }[];
  setStep?: (step: number) => void;
  className?: {
    container: string;
  };
};

export function MultistepFormProgress({
  steps,
  totalSteps,
  currentStep,
  setStep,
  className,
}: MultistepFormProgressProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-around border rounded-2xl p-3 px-5 gap-6 bg-overlay",
        className?.container,
      )}
    >
      {steps.map((step, stepIndex) => {
        const isCurrentStep = currentStep === step.id;
        const isCompletedStep = currentStep > step.id;
        return (
          <div
            key={`step-${step.id}`}
            className="flex items-center h-full gap-6"
          >
            {stepIndex > 0 && (
              <Separator orientation="vertical" className="h-8" />
            )}
            <Button
              className={cn(
                "flex items-center gap-3",
                Boolean(setStep) && "cursor-pointer",
                isCurrentStep && "cursor-default",
              )}
              onPress={() => setStep?.(step.id)}
            >
              <div
                className={cn(
                  "duration-300 shrink-0 size-9 rounded-full flex items-center justify-center",
                  isCompletedStep || isCurrentStep
                    ? "bg-primary"
                    : "bg-transparent border",
                )}
              >
                <HugeiconsIcon
                  icon={step.icon}
                  altIcon={Tick01Icon}
                  showAlt={isCompletedStep}
                  className={cn(
                    "duration-300",
                    isCompletedStep ? "text-bg" : "text-muted-fg",
                    isCurrentStep && "text-primary-fg",
                  )}
                  size={16}
                />
              </div>
              <div className="flex flex-col">
                <p className={cn("text-left text-xs text-muted-fg")}>
                  Step {step.id}/{totalSteps}
                </p>
                <p className="text-sm font-semibold">{step.name}</p>
              </div>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
