import { HugeiconsIcon } from "@hugeicons/react";
import {
  DeleteIcon,
  UserAdd01Icon,
  UserAdd02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Menu } from "@/shared/components/ui/menu";
import { useStudentLimits } from "@/shared/hooks/plan-limits/use-student-limits";

import { useStudentsByHubId } from "../../hooks/students/use-students-by-hub-id";
import { getHubByIdQueryOptions } from "../../lib/hub-query-options";
import { HubPanelHeader } from "../hub-panel-header";
import { SkeletonStudentListView } from "./skeleton-student-list-view";
import { StudentsListView } from "./students-list-view";

const DynamicCreateStudentFormModal = dynamic(
  () =>
    import("./create-student-form-modal").then(
      (mod) => mod.CreateStudentFormModal,
    ),
  {
    ssr: false,
  },
);

const DynamicAddStudentModal = dynamic(
  () => import("./add-student-modal").then((mod) => mod.AddStudentModal),
  {
    ssr: false,
  },
);

export const Students = ({ hubId }: { hubId: number }) => {
  const [isAddStudentFormModalOpen, setIsAddStudentFormModalOpen] =
    useState(false);
  const studentLimit = useStudentLimits();
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const { data: students, isPending } = useStudentsByHubId(hubId);
  const { data: hub } = useQuery(getHubByIdQueryOptions(hubId));
  const viewOnlyMode = hub?.status === "inactive";

  const getFromScratchAriaLabel = () => {
    if (studentLimit.isAtLimit)
      return `Student limit reached. ${studentLimit.current} of ${studentLimit.max} students used`;
    return `Create new student${!studentLimit.isUnlimited ? `. ${studentLimit.remaining} remaining` : ""}`;
  };

  const getFromScratchLabel = () => {
    if (studentLimit.isAtLimit) return "From scratch (limit reached)";
    return "From scratch";
  };

  return (
    <>
      <div className="min-h-0">
        <HubPanelHeader
          title="Course Students"
          actions={
            <Menu>
              <Button
                className={"w-full sm:w-fit"}
                intent="primary"
                isDisabled={viewOnlyMode}
              >
                <HugeiconsIcon
                  icon={UserAdd02Icon}
                  altIcon={DeleteIcon}
                  data-slot="icon"
                />
                <p>Add student</p>
              </Button>
              <Menu.Content placement="bottom end">
                <Menu.Item
                  onAction={() => setIsAddStudentModalOpen(true)}
                  id="from-students"
                  className="text-sm"
                  aria-label={getFromScratchAriaLabel()}
                >
                  From students
                </Menu.Item>

                <Menu.Item
                  onAction={() => setIsAddStudentFormModalOpen(true)}
                  id="from-scratch"
                  className="text-sm"
                  isDisabled={studentLimit.isAtLimit}
                >
                  {getFromScratchLabel()}
                </Menu.Item>
              </Menu.Content>
            </Menu>
          }
        />

        {isPending ? (
          <SkeletonStudentListView />
        ) : students?.length === 0 ? (
          <EmptyState
            title="No students enrolled"
            description="Add students to your course to see them here."
            icon={UserAdd01Icon}
            action={
              <Button
                intent="primary"
                isDisabled={viewOnlyMode}
                onPress={() => setIsAddStudentModalOpen(true)}
              >
                Add student
              </Button>
            }
          />
        ) : (
          <StudentsListView hubId={hubId} />
        )}
      </div>
      <DynamicCreateStudentFormModal
        hubId={hubId}
        isOpen={isAddStudentFormModalOpen}
        onOpenChange={setIsAddStudentFormModalOpen}
      />
      <DynamicAddStudentModal
        hubId={hubId}
        isOpen={isAddStudentModalOpen}
        onOpenChange={setIsAddStudentModalOpen}
      />
    </>
  );
};
