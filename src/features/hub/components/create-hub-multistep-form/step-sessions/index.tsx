"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-solid-rounded";
import { AddIcon } from "@hugeicons-pro/core-stroke-rounded";
import { useState } from "react";
import { toast } from "sonner";

import { Heading } from "@/shared/components/ui/heading";
import { Button } from "@/ui/button";
import { ProgressCircle } from "@/ui/progress-circle";
import { cn } from "@/shared/lib/classes";

import { useCreateHub } from "@/features/hub/hooks/use-create-hub";
import { useHubFormStore } from "../../../store/hub-form-store";
import { SessionModal } from "./session-modal";
import { SessionsList } from "./sessions-list";

export function StepSessions() {
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const prevStep = useHubFormStore((state) => state.prevStep);

  const { mutate: createHub, isPending } = useCreateHub();

  const students = useHubFormStore((state) => state.students);
  const sessions = useHubFormStore((state) => state.sessions);
  const hubInfo = useHubFormStore((state) => state.hubInfo);

  const handleCreateHub = () => {
    if (!hubInfo.name || !hubInfo.startDate) {
      toast.error("Hub name is required");
      return;
    }

    console.log({
      studentIds: students.map((student) => student.id),
      sessions: sessions, // Use index since sessions don't have IDs yet
      hubInfo: {
        ...hubInfo,
        name: hubInfo.name,
        startDate: hubInfo.startDate?.toString(),
        endDate: hubInfo.endDate?.toString(),
      },
    });

    createHub({
      studentIds: students.map((student) => student.id),
      sessions: sessions,
      hubInfo: {
        ...hubInfo,
        name: hubInfo.name,
        startDate: hubInfo.startDate?.toString(),
        endDate: hubInfo.endDate?.toString(),
      },
    });
  };

  return (
    <>
      <div className="w-full space-y-4">
        <div className={cn("w-full flex items-center gap-2 justify-between")}>
          <Heading level={3} className="font-semibold">
            Scheduled Sessions
          </Heading>
          <Button onPress={() => setIsSessionModalOpen(true)}>
            <HugeiconsIcon icon={AddIcon} size={16} data-slot="icon" />
            <span className="hidden sm:block">Add Sessions</span>
          </Button>
        </div>

        {/* Sessions List */}
        <SessionsList />

        <div
          className={cn(
            "flex flex-col-reverse fixed bottom-0 border-t left-0 bg-overlay p-4 w-full gap-2 ",
            "sm:relative sm:p-0 sm:flex-row sm:justify-between sm:border-none",
          )}
        >
          <Button intent="outline" onPress={prevStep} isDisabled={isPending}>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
            Back
          </Button>

          <Button
            onPress={handleCreateHub}
            className="px-6"
            isDisabled={isPending}
          >
            {isPending && (
              <ProgressCircle isIndeterminate aria-label="Creating hub..." />
            )}
            {isPending ? "Creating..." : "Create Hub"}
          </Button>
        </div>
      </div>
      <SessionModal
        isOpen={isSessionModalOpen}
        onOpenChange={setIsSessionModalOpen}
      />
    </>
  );
}
