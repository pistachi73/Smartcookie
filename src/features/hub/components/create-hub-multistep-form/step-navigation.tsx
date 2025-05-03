"use client";

import { Button } from "@/shared/components/ui/button";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useHubFormStore } from "../../store/hub-form-store";

export function StepNavigation() {
  const currentStep = useHubFormStore((state) => state.currentStep);
  const totalSteps = useHubFormStore((state) => state.totalSteps);
  const prevStep = useHubFormStore((state) => state.prevStep);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-end w-full gap-4 shrink-0">
      {!isFirstStep && (
        <Button intent="plain" onPress={prevStep} shape="square">
          <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
          Back
        </Button>
      )}

      <Button type="submit" form="step-form" shape="square" className="px-6">
        {isLastStep ? "Create Hub" : "Next"}
      </Button>
    </div>
  );
}
