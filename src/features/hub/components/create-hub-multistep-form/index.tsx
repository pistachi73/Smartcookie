"use client";

import { Heading } from "@/shared/components/ui/heading";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import { toast } from "sonner";
import { useCreateHub } from "../../hooks/use-create-hub";
import { useHubFormStore } from "../../store/hub-form-store";
import { StepHubInfo } from "./step-hub-info";
import { StepNavigation } from "./step-navigation";

const DynamicStepHubInfo = dynamic(
  () => import("./step-hub-info").then((mod) => mod.StepHubInfo),
  {
    ssr: false,
  },
);

const DynamicStudentStep = dynamic(
  () => import("./step-students").then((mod) => mod.StepStudents),
  {
    ssr: false,
  },
);

const DynamicSessionStep = dynamic(
  () => import("./step-sessions").then((mod) => mod.StepSessions),
  {
    ssr: false,
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

interface CreateHubMultistepFormProps {
  onComplete?: () => void;
  className?: string;
}

export function CreateHubMultistepForm({
  onComplete,
  className,
}: CreateHubMultistepFormProps) {
  const currentStep = useHubFormStore((state) => state.currentStep);
  const hubInfo = useHubFormStore((state) => state.hubInfo);
  const students = useHubFormStore((state) => state.students);
  const sessions = useHubFormStore((state) => state.sessions);
  const reset = useHubFormStore((state) => state.reset);
  const stepValidation = useHubFormStore((state) => state.stepValidation);

  const { mutate: createHub, isPending: isCreatingHub } = useCreateHub({
    onSuccess: () => {
      toast.success("Hub created successfully");
      reset();
      if (onComplete) {
        onComplete();
      }
    },
  });

  const handleSubmit = useCallback(() => {
    // Submit all the data together
    const formData = {
      ...hubInfo,
      students,
      sessions,
    };

    createHub({ formData: hubInfo });
  }, [hubInfo, students, sessions, createHub]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StepHubInfo />;
      case 2:
        return <DynamicStudentStep />;
      case 3:
        return <DynamicSessionStep />;
      default:
        return <StepHubInfo />;
    }
  };

  const isLastStep = currentStep === 3;
  const canSubmit =
    isLastStep &&
    stepValidation.hubInfoValid &&
    stepValidation.studentsValid &&
    stepValidation.sessionsValid;

  const stepHeading = STEP_HEADING[currentStep];
  return (
    <div className="h-full w-full bg-overlay pt-8">
      <div className="w-full bg-overlay h-full overflow-y-auto flex flex-col items-center max-w-2xl mx-auto gap-6 px-2">
        {/* <StepProgress /> */}

        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex flex-col items-center gap-1 w-full">
            <Heading level={1} className="font-semibold text-left w-full">
              {stepHeading?.title}
            </Heading>
            <p className="text-base text-muted-fg w-full ">
              {stepHeading?.description}
            </p>
          </div>

          {renderCurrentStep()}
          <StepNavigation
            onSubmit={handleSubmit}
            canSubmit={canSubmit}
            isSubmitting={isCreatingHub}
          />
        </div>
      </div>
    </div>

    // <Card className={className}>
    //   <Card.Header>
    //     <Card.Title>Create New Hub</Card.Title>
    //   </Card.Header>

    //   <Card.Content className="space-y-6">
    //     <StepProgress />

    //     {renderCurrentStep()}
    //   </Card.Content>

    //   <Card.Footer className="flex justify-end">
    //     <StepNavigation
    //       onSubmit={handleSubmit}
    //       canSubmit={canSubmit}
    //       isSubmitting={isCreatingHub}
    //     />
    //   </Card.Footer>
    // </Card>
  );
}
