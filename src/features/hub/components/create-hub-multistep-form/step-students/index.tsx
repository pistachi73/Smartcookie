"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { UserAdd01Icon } from "@hugeicons-pro/core-solid-rounded";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { ComboBox } from "@/shared/components/ui/combo-box";
import { Loader } from "@/shared/components/ui/loader";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { StudentProfile } from "@/shared/components/students/student-profile";
import { cn } from "@/shared/lib/classes";

import { getStudentsByUserIdQueryOptions } from "@/features/hub/lib/user-students-query-options";
import { useHubFormStore } from "../../../store/hub-form-store";
import { SelectedStudentsTable } from "./selected-students-table";

const DynamicCreateStudentModal = dynamic(
  () => import("./create-student-modal").then((mod) => mod.CreateStudentModal),
  {
    ssr: true,
  },
);

export type SelectStudent = {
  id: number;
  name: string;
  email: string;
  image: string | null;
  isSelected: boolean;
};

export function StepStudents() {
  const { down } = useViewport();
  const isMobile = down("sm");

  const addStudent = useHubFormStore((state) => state.addStudent);
  const removeStudent = useHubFormStore((state) => state.removeStudent);
  const students = useHubFormStore((state) => state.students);
  const nextStep = useHubFormStore((state) => state.nextStep);
  const prevStep = useHubFormStore((state) => state.prevStep);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const studentsQueryOptions = getStudentsByUserIdQueryOptions();
  const { data: existingStudents, isFetching } = useQuery({
    ...studentsQueryOptions,
  });

  const onStudentSelectionChange = (key: string) => {
    const isAlreadyAdded = students.some(
      (student) => student.id === Number(key),
    );

    if (isAlreadyAdded) {
      removeStudent(Number(key));
    } else {
      const selectedStudent = existingStudents?.find(
        (student) => student.id === Number(key),
      );
      if (selectedStudent) {
        addStudent(selectedStudent);
      }
    }
  };

  const getStudentsWithSelection = () => {
    return (
      existingStudents?.map((student) => ({
        ...student,
        isSelected: students.some((s) => s.id === student.id),
      })) ?? []
    );
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
              onSelectionChange={(key) =>
                onStudentSelectionChange(key as string)
              }
            >
              <ComboBox.Input />
              {isFetching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin">
                  <Loader />
                </div>
              )}
              <ComboBox.List
                renderEmptyState={() => (
                  <div className="text-muted-fg text-base italic p-4 text-center">
                    No students found
                  </div>
                )}
                items={getStudentsWithSelection()}
                popover={{
                  className: "w-[calc(var(--trigger-width))]",
                }}
              >
                {(item) => {
                  return (
                    <ComboBox.Option id={item.id} textValue={item.name}>
                      <StudentProfile
                        name={item.name}
                        email={item.email}
                        image={item.image}
                        avatarSize="md"
                        isSelected={item.isSelected}
                      />
                    </ComboBox.Option>
                  );
                }}
              </ComboBox.List>
            </ComboBox>
          </div>
          <Button onPress={() => setIsCreateModalOpen(true)}>
            <HugeiconsIcon icon={UserAdd01Icon} size={16} data-slot="icon" />
            <span className="hidden sm:block">New Student</span>
          </Button>
        </div>

        <SelectedStudentsTable />

        <div className="mb-0! h-30 w-full block sm:hidden" aria-hidden="true" />

        <div
          className={cn(
            "flex flex-col-reverse fixed bottom-0 border-t left-0 bg-overlay p-4 w-full gap-2 ",
            "sm:relative sm:p-0 sm:flex-row sm:justify-between sm:border-none",
          )}
        >
          <Button
            intent="outline"
            size={isMobile ? "sm" : "md"}
            onPress={prevStep}
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={16} data-slot="icon" />
            Back
          </Button>
          <Button
            size={isMobile ? "sm" : "md"}
            onPress={nextStep}
            className="px-6"
          >
            Continue to sessions
            <HugeiconsIcon icon={ArrowRight02Icon} size={16} data-slot="icon" />
          </Button>
        </div>
      </div>

      <DynamicCreateStudentModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
      />
    </>
  );
}
