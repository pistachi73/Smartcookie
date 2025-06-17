"use client";

import { Card } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { MultistepFormProgress } from "@/shared/components/ui/multistep-form-progress";
import { Separator } from "@/shared/components/ui/separator";
import {
  Book02Icon,
  FolderDetailsIcon,
  UserMultiple02Icon,
} from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import dynamic from "next/dynamic";
import { useHubFormStore } from "../../store/hub-form-store";
import { StepHubInfo } from "./step-hub-info";

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

const STEP_HEADING: Record<
  number,
  { title: string; description: string; icon: typeof FolderDetailsIcon }
> = {
  1: {
    title: "Hub Information",
    description: "Let's start with the basic information about your hub.",
    icon: FolderDetailsIcon,
  },
  2: {
    title: "Students Management",
    description: "Add and organize students who will participate in this hub.",
    icon: UserMultiple02Icon,
  },
  3: {
    title: "Sessions Planning",
    description: "Schedule sessions and manage your learning sessions.",
    icon: Book02Icon,
  },
};

export function CreateHubMultistepForm() {
  const currentStep = useHubFormStore((state) => state.currentStep);
  const stepHeading = STEP_HEADING[currentStep];

  return (
    <div className="h-full w-full bg-bg overflow-y-auto pt-12 pb-12 px-4">
      <div className="w-full bg-bg flex flex-col items-center max-w-3xl mx-auto gap-6">
        <div className="flex flex-col items-center gap-6 w-full ">
          <div className="flex flex-col items-center gap-2 text-center max-w-2xl">
            <Heading
              level={1}
              tracking="tight"
              className="sm:text-2xl font-bold"
            >
              Create New Hub
            </Heading>
            <p className="text-base text-muted-fg leading-relaxed max-w-[34ch]">
              Organize students, track progress, and manage sessions in one
              place.
            </p>
          </div>

          <MultistepFormProgress
            totalSteps={3}
            currentStep={currentStep}
            steps={[
              { id: 1, name: "Hub Info", icon: FolderDetailsIcon },
              { id: 2, name: "Students", icon: UserMultiple02Icon },
              { id: 3, name: "Sessions", icon: Book02Icon },
            ]}
          />

          <Card className="w-full bg-overlay">
            <Card.Header className="flex flex-row items-center gap-3">
              <div className="size-12 rounded-xl bg-primary-tint flex items-center justify-center">
                <HugeiconsIcon
                  icon={stepHeading?.icon!}
                  size={18}
                  className="text-primary"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <Card.Title className="text-xl font-semibold">
                  {stepHeading?.title}
                </Card.Title>
                <Card.Description>{stepHeading?.description}</Card.Description>
              </div>
            </Card.Header>
            <Separator />
            <Card.Content>
              {currentStep === 1 && <StepHubInfo />}
              {currentStep === 2 && <DynamicStudentStep />}
              {currentStep === 3 && <DynamicSessionStep />}
            </Card.Content>
          </Card>
          {/* <StepNavigation /> */}
        </div>
      </div>
    </div>
  );
}
