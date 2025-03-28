"use client";

import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/classes";
import {
  Book02Icon,
  FolderDetailsIcon,
  UserMultiple02Icon,
} from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import * as m from "motion/react-m";
import { useHubFormStore } from "../../store/hub-form-store";

const steps = [
  { id: 1, name: "Hub Info", icon: FolderDetailsIcon },
  { id: 2, name: "Students", icon: UserMultiple02Icon },
  { id: 3, name: "Sessions", icon: Book02Icon },
];

export function StepProgress() {
  const currentStep = useHubFormStore((state) => state.currentStep);
  const totalSteps = useHubFormStore((state) => state.totalSteps);

  return (
    <m.div
      layout
      className="w-fit flex items-center justify-between border rounded-lg p-3 px-4 gap-4 bg-overlay"
    >
      {steps.map((step, stepIndex) => {
        const isCurrentStep = currentStep === step.id;
        const isCompletedStep = currentStep > step.id;
        return (
          <div
            key={`step-${step.id}`}
            className="flex items-center h-full gap-4"
          >
            {stepIndex > 0 && (
              <Separator orientation="vertical" className="h-8" />
            )}
            <div key={`step-${step.id}`} className="flex items-center gap-3">
              <div
                className={cn(
                  "transition-colors duration-300 shrink-0 size-10 rounded-full flex items-center justify-center",
                  isCompletedStep
                    ? "bg-[color-mix(in_oklab,var(--color-primary)_50%,white_50%)]/10"
                    : "bg-transparent",
                  isCurrentStep && "bg-primary",
                )}
              >
                <HugeiconsIcon
                  icon={step.icon}
                  className={cn(
                    "transition-colors duration-300",
                    isCompletedStep ? "text-primary" : "text-muted-fg",
                    isCurrentStep && "text-primary-fg",
                  )}
                  size={18}
                />
              </div>
              {isCurrentStep && (
                <m.div className="flex flex-col">
                  <p className="text-xs text-primary/80">
                    Step {step.id}/{totalSteps}
                  </p>
                  <p className="text-sm font-semibold">{step.name}</p>
                </m.div>
              )}
            </div>
          </div>
        );
      })}
    </m.div>
  );
}
