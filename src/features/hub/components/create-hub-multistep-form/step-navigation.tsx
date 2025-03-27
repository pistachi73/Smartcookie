"use client";

import { Button } from "@/shared/components/ui/button";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useHubFormStore } from "../../store/hub-form-store";

interface StepNavigationProps {
  onSubmit: () => void;
  canSubmit: boolean;
  isSubmitting: boolean;
}

export function StepNavigation({
  onSubmit,
  canSubmit,
  isSubmitting,
}: StepNavigationProps) {
  const currentStep = useHubFormStore((state) => state.currentStep);
  const totalSteps = useHubFormStore((state) => state.totalSteps);
  const nextStep = useHubFormStore((state) => state.nextStep);
  const prevStep = useHubFormStore((state) => state.prevStep);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-end w-full gap-4">
      {/* {!isFirstStep && ( */}
      <Button appearance="plain" onPress={prevStep} shape="square">
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        Back
      </Button>
      {/* )} */}

      {isLastStep ? (
        <Button
          shape="square"
          onPress={onSubmit}
          isDisabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Hub"}
        </Button>
      ) : (
        <Button shape="square" onPress={nextStep} className="px-6">
          Next
        </Button>
      )}
    </div>
  );
}
