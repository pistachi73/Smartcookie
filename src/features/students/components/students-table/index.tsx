"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Archive02Icon,
  MoreHorizontalIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useState } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Menu } from "@/shared/components/ui/menu";
import { Table } from "@/shared/components/ui/table";
import { StudentProfile } from "@/shared/components/students/student-profile";

import type { Student } from "../../types/student.types";
import { DeleteStudentModal } from "../delete-student-modal";
import { columns } from "./columns";

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
            const isActive = student.status === "active";
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
                    intent={
                      student.status === "active" ? "success" : "secondary"
                    }
                  >
                    {!isActive && (
                      <HugeiconsIcon icon={Archive02Icon} size={12} />
                    )}
                    {isActive ? "Active" : "Archived"}
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
