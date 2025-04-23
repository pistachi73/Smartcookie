import { Button } from "@/shared/components/ui/button";
import { Menu } from "@/shared/components/ui/menu";
import { Table } from "@/shared/components/ui/table";
import { UserAvatar } from "@/shared/components/ui/user-avatar";
import { MoreHorizontalIcon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useStudentsByHubId } from "../../hooks/students/use-students-by-hub-id";
import { AttendanceBar } from "./attendance-bar";
import { SkeletonStudentListView } from "./skeleton-student-list-view";

const DynamicRemoveStudentModal = dynamic(
  () => import("./remove-student-modal").then((mod) => mod.RemoveStudentModal),
  {
    ssr: false,
  },
);

export const StudentsListView = ({ hubId }: { hubId: number }) => {
  const { data: students, isPending } = useStudentsByHubId(hubId);
  const [selectedStudent, setSelectedStudent] = useState<number>();
  const [isRemoveStudentModalOpen, setIsRemoveStudentModalOpen] =
    useState(false);

  const handleRemoveStudent = (studentId: number) => {
    setSelectedStudent(studentId);
    setIsRemoveStudentModalOpen(true);
  };

  if (isPending) return <SkeletonStudentListView />;

  return (
    <>
      <Table aria-label="Students">
        <Table.Header>
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
                <UserAvatar userImage={image} userName={name} size="medium" />
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-muted-fg">{email}</p>
                </div>
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
                    <Button
                      appearance="outline"
                      size="square-petite"
                      className={"size-7"}
                    >
                      <HugeiconsIcon
                        icon={MoreHorizontalIcon}
                        data-slot="icon"
                        size={18}
                      />
                    </Button>
                    <Menu.Content aria-label="Actions" placement="bottom end">
                      <Menu.Item href={`/portal/students/${id}`}>
                        View
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
