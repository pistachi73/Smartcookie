import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Menu } from "@/shared/components/ui/menu";
import { MoreVerticalIcon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

import { Separator } from "@/shared/components/ui/separator";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useStudentsByHubId } from "../../hooks/students/use-students-by-hub-id";
import type { getStudentsByHubIdUseCase } from "../../use-cases/students.use-case";
import { StudentProfile } from "../create-hub-multistep-form/step-students/student-profile";
import { AttendanceBar } from "./attendance-bar";

const DynamicRemoveStudentModal = dynamic(
  () => import("./remove-student-modal").then((mod) => mod.RemoveStudentModal),
  { ssr: false },
);

const StudentCard = ({
  student,
  setSelectedStudent,
  setIsRemoveStudentModalOpen,
}: {
  student: Awaited<ReturnType<typeof getStudentsByHubIdUseCase>>[number];
  setSelectedStudent: (studentId: number) => void;
  setIsRemoveStudentModalOpen: (isOpen: boolean) => void;
}) => {
  const handleRemoveStudent = (studentId: number) => {
    setSelectedStudent(studentId);
    setIsRemoveStudentModalOpen(true);
  };

  return (
    <Card className="relative">
      <Card.Header className="w-full p-4 flex flex-row gap-4 justify-between items-center">
        <StudentProfile
          name={student.name}
          email={student.email}
          image={student.image}
        />
        <Menu>
          <Button
            appearance="outline"
            size="square-petite"
            className={"size-7"}
          >
            <HugeiconsIcon icon={MoreVerticalIcon} data-slot="icon" size={18} />
          </Button>
          <Menu.Content aria-label="Actions" placement="left top">
            <Menu.Item href={`/portal/students/${student.id}`}>View</Menu.Item>
            <Menu.Separator />
            <Menu.Item
              isDanger
              onAction={() => handleRemoveStudent(student.id)}
            >
              Delete
            </Menu.Item>
          </Menu.Content>
        </Menu>
      </Card.Header>
      <Card.Content className="px-4 pb-4 space-y-4">
        <Separator />
        <AttendanceBar
          attendedSessions={student.presentSessions}
          totalSessions={student.completedSessions}
        />
      </Card.Content>
    </Card>
  );
};

export const StudentsCardView = ({ hubId }: { hubId: number }) => {
  const { data: students, isPending } = useStudentsByHubId(hubId);
  const [selectedStudent, setSelectedStudent] = useState<number>();
  const [isRemoveStudentModalOpen, setIsRemoveStudentModalOpen] =
    useState(false);

  // if (isPending) return <SkeletonStudentCardView />;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students?.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            setSelectedStudent={setSelectedStudent}
            setIsRemoveStudentModalOpen={setIsRemoveStudentModalOpen}
          />
        ))}
      </div>
      <DynamicRemoveStudentModal
        studentId={selectedStudent}
        hubId={hubId}
        isOpen={isRemoveStudentModalOpen}
        onOpenChange={setIsRemoveStudentModalOpen}
      />
    </>
  );
};
