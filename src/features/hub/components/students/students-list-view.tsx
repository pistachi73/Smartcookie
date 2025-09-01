import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon } from "@hugeicons-pro/core-stroke-rounded";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Menu } from "@/shared/components/ui/menu";
import { Table } from "@/shared/components/ui/table";
import { StudentProfile } from "@/shared/components/students/student-profile";
import { cn } from "@/shared/lib/utils";

import { useStudentsByHubId } from "../../hooks/students/use-students-by-hub-id";
import { AttendanceBar } from "./attendance-bar";

const DynamicRemoveStudentModal = dynamic(
  () => import("./remove-student-modal").then((mod) => mod.RemoveStudentModal),
  {
    ssr: false,
  },
);

export const StudentsListView = ({ hubId }: { hubId: number }) => {
  const { data: students } = useStudentsByHubId(hubId);
  const [selectedStudent, setSelectedStudent] = useState<number>();
  const [isRemoveStudentModalOpen, setIsRemoveStudentModalOpen] =
    useState(false);

  const handleRemoveStudent = (studentId: number) => {
    setSelectedStudent(studentId);
    setIsRemoveStudentModalOpen(true);
  };

  return (
    <>
      <Table
        aria-label="Students"
        bleed
        className={cn(
          " border-t",
          "[--gutter:--spacing(4)] sm:[--gutter:--spacing(6)]",
          "[--gutter-y:--spacing(3)]",
        )}
      >
        <Table.Header className={"bg-muted "}>
          <Table.Column isRowHeader id="name">
            Student Name
          </Table.Column>
          <Table.Column className="h-full">
            Attendance (completed sessions)
          </Table.Column>
          <Table.Column />
        </Table.Header>
        <Table.Body
          items={students}
          renderEmptyState={() => (
            <div className="flex justify-center items-center p-4 mt-2 rounded-lg">
              <p className="text-sm text-muted-fg italic">No students found</p>
            </div>
          )}
        >
          {({ id, name, email, image, completedSessions, presentSessions }) => (
            <Table.Row key={`${id}-${name}`}>
              <Table.Cell className="flex items-center gap-3">
                <StudentProfile name={name} email={email} image={image} />
              </Table.Cell>
              <Table.Cell>
                <AttendanceBar
                  attendedSessions={presentSessions}
                  totalSessions={completedSessions}
                />
              </Table.Cell>
              <Table.Cell className="max-w-[56px]">
                <div className="flex justify-end">
                  <Menu>
                    <Button intent="outline" size="sq-sm" className={"size-7"}>
                      <HugeiconsIcon
                        icon={MoreHorizontalIcon}
                        data-slot="icon"
                        size={18}
                      />
                    </Button>
                    <Menu.Content aria-label="Actions" placement="bottom end">
                      <Menu.Item href={`/portal/students/${id}`}>
                        View student
                      </Menu.Item>
                      <Menu.Separator />
                      <Menu.Item
                        isDanger
                        onAction={() => handleRemoveStudent(id)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Content>
                  </Menu>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <DynamicRemoveStudentModal
        studentId={selectedStudent}
        hubId={hubId}
        isOpen={isRemoveStudentModalOpen}
        onOpenChange={setIsRemoveStudentModalOpen}
      />
    </>
  );
};
