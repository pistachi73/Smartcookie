"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon } from "@hugeicons-pro/core-stroke-rounded";
import { useState } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Menu } from "@/shared/components/ui/menu";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Table } from "@/shared/components/ui/table";
import { StudentProfile } from "@/shared/components/students/student-profile";

import type { Student } from "../../types/student.types";
import { DeleteStudentModal } from "../delete-student-modal";

const columns = [
  { id: "name", name: "Name", isRowHeader: true },
  { id: "phone", name: "Phone" },
  { id: "location", name: "Location" },
  { id: "motherLanguage", name: "Mother Language" },
  { id: "learningLanguage", name: "Learning Language" },
  { id: "status", name: "Status" },
  { id: "actions", name: "Actions" },
];

type SkeletonItem = {
  id: number;
};

export const StudentsTableSkeleton = () => {
  const items: SkeletonItem[] = Array.from({ length: 5 }, (_, i) => ({
    id: i,
  }));

  return (
    <Table
      aria-label="Loading students"
      bleed
      className="[--gutter:var(--card-spacing)] sm:[--gutter:var(--card-spacing)] border-b [--gutter-y:--spacing(3)]"
    >
      <Table.Header columns={columns}>
        {columns.map((column) => (
          <Table.Column key={column.id} isRowHeader={column.isRowHeader}>
            {column.name}
          </Table.Column>
        ))}
      </Table.Header>
      <Table.Body items={items}>
        {() => (
          <Table.Row>
            <Table.Cell className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="space-y-0.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            </Table.Cell>
            <Table.Cell>
              <Skeleton className="h-4 w-28" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton className="h-4 w-24" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton className="h-4 w-20" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton className="h-4 w-20" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton className="h-5 w-16 rounded-full" />
            </Table.Cell>
            <Table.Cell className="max-w-[56px]">
              <div className="flex justify-end">
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

// Table component with phone formatting, loading states, and error handling

export const StudentsTable = ({ students }: { students: Student[] }) => {
  const [deleteStudent, setDeleteStudent] = useState<Student | undefined>(
    undefined,
  );
  const [isDeleteStudentModalOpen, setIsDeleteStudentModalOpen] =
    useState(false);

  const handleDeleteStudent = (student: Student) => {
    setDeleteStudent(student);
    setIsDeleteStudentModalOpen(true);
  };
  return (
    <>
      <Table
        aria-label="Students table"
        bleed
        className="[--gutter:var(--card-spacing)] sm:[--gutter:var(--card-spacing)] border-b [--gutter-y:--spacing(3)]"
      >
        <Table.Header>
          {columns.map((column) => (
            <Table.Column
              key={column.id}
              isRowHeader={column.isRowHeader}
              id={column.id}
            >
              {column.name}
            </Table.Column>
          ))}
        </Table.Header>
        <Table.Body
          items={students ?? []}
          renderEmptyState={() => (
            <div className="flex justify-center items-center p-4 my-2 rounded-lg">
              <p className="text-sm text-muted-fg italic">No students found</p>
            </div>
          )}
        >
          {(student) => {
            return (
              <Table.Row
                key={`${student.id}-${student.name}`}
                href={`/portal/students/${student.id}`}
              >
                <Table.Cell className="flex items-center gap-3">
                  <StudentProfile
                    name={student.name}
                    email={student.email}
                    image={student.image}
                  />
                </Table.Cell>
                <Table.Cell>{student.phone || "-"}</Table.Cell>
                <Table.Cell>{student.location ?? "-"}</Table.Cell>
                <Table.Cell>{student.motherLanguage ?? "-"}</Table.Cell>
                <Table.Cell>{student.learningLanguage ?? "-"}</Table.Cell>
                <Table.Cell>
                  <Badge
                    className="first-letter:uppercase!"
                    intent={student.status === "active" ? "success" : "danger"}
                  >
                    {student.status ?? "-"}
                  </Badge>
                </Table.Cell>

                <Table.Cell className="max-w-[56px]">
                  <div className="flex justify-end">
                    <Menu>
                      <Button
                        intent="outline"
                        size="sq-sm"
                        className={"size-7"}
                      >
                        <HugeiconsIcon
                          icon={MoreHorizontalIcon}
                          data-slot="icon"
                          size={18}
                        />
                      </Button>
                      <Menu.Content aria-label="Actions" placement="bottom end">
                        <Menu.Item href={`/portal/students/${student.id}`}>
                          View student
                        </Menu.Item>
                        <Menu.Separator />
                        <Menu.Item
                          isDanger
                          onAction={() => handleDeleteStudent(student)}
                        >
                          Delete student
                        </Menu.Item>
                      </Menu.Content>
                    </Menu>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          }}
        </Table.Body>
      </Table>
      <DeleteStudentModal
        student={deleteStudent}
        isOpen={isDeleteStudentModalOpen}
        onOpenChange={setIsDeleteStudentModalOpen}
      />
    </>
  );
};
