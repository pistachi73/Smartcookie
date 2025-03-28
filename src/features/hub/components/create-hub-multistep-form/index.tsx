"use client";

import { Heading } from "@/shared/components/ui/heading";
import dynamic from "next/dynamic";
import { useHubFormStore } from "../../store/hub-form-store";
import { StepHubInfo } from "./step-hub-info";
import { StepProgress } from "./step-progress";

const DynamicStudentStep = dynamic(
  () => import("./step-students").then((mod) => mod.StepStudents),
  {
    ssr: true,
  },
);

const DynamicSessionStep = dynamic(
  () => import("./step-sessions").then((mod) => mod.StepSessions),
  {
    ssr: true,
  },
);

const STEP_HEADING: Record<number, { title: string; description: string }> = {
  1: {
    title: "Hub Info",
    description: "Create a new hub to start tracking your students' progress.",
  },
  2: {
    title: "Students",
    description: "Add students to your hub to start tracking their progress.",
  },
  3: {
    title: "Sessions",
    description:
      "Add sessions to your hub to start tracking your students' progress.",
  },
};

export function CreateHubMultistepForm() {
  const currentStep = useHubFormStore((state) => state.currentStep);
  const stepHeading = STEP_HEADING[currentStep];

  return (
    <div className="h-full w-full bg-overlay pt-8">
      <div className="w-full bg-overlay h-full overflow-y-auto flex flex-col items-center max-w-2xl mx-auto gap-6 px-2">
        <StepProgress />

        <div className="flex flex-col items-center gap-6 w-full ">
          <div className="flex flex-col items-center gap-1 w-full">
            <Heading level={1} className="font-semibold text-left w-full">
              {stepHeading?.title}
            </Heading>
            <p className="text-base text-muted-fg w-full ">
              {stepHeading?.description}
            </p>
          </div>

          {currentStep === 1 && <StepHubInfo />}
          {currentStep === 2 && <DynamicStudentStep />}
          {currentStep === 3 && <DynamicSessionStep />}
          {/* <StepNavigation /> */}
        </div>
      </div>
    </div>
  );
}
