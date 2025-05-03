"use client";

import {
  ArrowLeft02Icon,
  UserAdd01Icon,
} from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/ui/button";
import { ComboBox } from "@/ui/combo-box";
import { ProgressCircle } from "@/ui/progress-circle";

import { useCreateHub } from "@/features/hub/hooks/use-create-hub";
import type { SerializedHubInfoValues } from "@/features/hub/lib/schemas";

import { cn } from "@/shared/lib/classes";

import { useHubFormStore } from "../../../store/hub-form-store";

export function StepSessions() {
  const prevStep = useHubFormStore((state) => state.prevStep);

  const { mutate: createHub, isPending } = useCreateHub();

  const students = useHubFormStore((state) => state.students);
  const sessions = useHubFormStore((state) => state.sessions);
  const hubInfo = useHubFormStore((state) => state.hubInfo);

  const handleCreateHub = () => {
    const data = {
      studentIds: students.map((student) => student.id),
      sessionIds: sessions.map((session) => session.id),
      hubInfo: {
        ...hubInfo,
        startDate: hubInfo.startDate?.toString(),
        endDate: hubInfo.endDate?.toString(),
      } as SerializedHubInfoValues,
    };

    createHub(data);
  };

  return (
    <>
      <div className="w-full space-y-4">
        <div className={cn("w-full flex items-center gap-2 ")}>
          <div className="relative flex-1 ">
            <ComboBox
              placeholder="Search existing student..."
              menuTrigger="focus"
              selectedKey={null}
              allowsEmptyCollection={true}
            >
              <ComboBox.Input
                className={{
                  fieldGroup: "h-10 sm:h-12 bg-overlay-highlight",
                }}
              />

              <ComboBox.List
                renderEmptyState={() => (
                  <div className="flex flex-col items-center p-6 gap-0.5">
                    <p className="text-lg font-medium">No students found</p>
                    <p className="text-sm text-muted-fg">
                      You can search by name or email
                    </p>
                  </div>
                )}
                items={[]}
                className={{
                  popoverContent:
                    "bg-overlay-highlight w-[calc(var(--trigger-width))]",
                }}
                showArrow={false}
              >
                {(item) => {
                  return (
                    <ComboBox.Option
                      id={"id"}
                      textValue={"name"}
                      className={"flex gap-3"}
                    >
                      test
                    </ComboBox.Option>
                  );
                }}
              </ComboBox.List>
            </ComboBox>
          </div>
          <Button
            shape="square"
            className="shrink-0 h-10 w-10 sm:w-fit sm:h-12"
          >
            <HugeiconsIcon icon={UserAdd01Icon} size={16} data-slot="icon" />
            <span className="hidden sm:block">New Session</span>
          </Button>
        </div>

        <div className="flex justify-end w-full gap-4 shrink-0">
          <Button
            intent="plain"
            onPress={prevStep}
            shape="square"
            isDisabled={isPending}
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
            Back
          </Button>

          <Button
            onPress={handleCreateHub}
            shape="square"
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
    </>
  );
}
