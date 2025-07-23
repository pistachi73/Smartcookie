import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";

import { useSurveyStore } from "../store/survey-store-provider";

export const SurveyOutBoundaries = () => {
  const setCurrentStep = useSurveyStore((store) => store.setStep);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-bg text-center px-4">
      <div className="flex flex-col items-center gap-4 p-8 border bg-overlay rounded-2xl shdow-md">
        <span className="text-6xl text-muted-fg">😢</span>
        <Heading level={1}>Out of Form Boundaries</Heading>
        <div className="space-y-1">
          <p className="text-muted-fg text-base text-pretty">
            You have reached a step that is outside the boundaries of this form.
          </p>
          <p className="text-muted-fg text-base text-pretty">
            Please return to the beginning or contact your teacher for help.
          </p>
        </div>
        <Button
          className="mt-6"
          type="button"
          onPress={() => setCurrentStep(0)}
        >
          Go to Start
        </Button>
      </div>
    </div>
  );
};
