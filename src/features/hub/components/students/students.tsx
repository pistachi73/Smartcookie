import { HugeiconsIcon } from "@hugeicons/react";
import { DeleteIcon, UserAdd02Icon } from "@hugeicons-pro/core-stroke-rounded";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Menu } from "@/shared/components/ui/menu";

import { HubPanelHeader } from "../hub-panel-header";
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
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-0">
        <HubPanelHeader
          title="Course Students"
          actions={
            <Menu>
              <Button className={"w-full sm:w-fit"} size="sm" intent="primary">
                <HugeiconsIcon
                  icon={UserAdd02Icon}
                  altIcon={DeleteIcon}
                  size={16}
                  data-slot="icon"
                />
                <p>Add student</p>
              </Button>
              <Menu.Content placement="bottom end">
                <Menu.Item
                  onAction={() => setIsAddStudentModalOpen(true)}
                  id="from-students"
                  className="text-sm"
                >
                  From students
                </Menu.Item>
                <Menu.Item
                  onAction={() => setIsAddStudentFormModalOpen(true)}
                  id="from-scratch"
                  className="text-sm"
                >
                  From scratch
                </Menu.Item>
              </Menu.Content>
            </Menu>
          }
        />

        <StudentsListView hubId={hubId} />
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
