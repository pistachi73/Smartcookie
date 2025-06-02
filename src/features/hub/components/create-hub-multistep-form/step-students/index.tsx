"use client";

import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { StudentProfile } from "@/shared/components/students/student-profile";
import { Button } from "@/shared/components/ui/button";
import { ComboBox } from "@/shared/components/ui/combo-box";
import { Loader } from "@/shared/components/ui/loader";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { cn } from "@/shared/lib/classes";
import { UserAdd01Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";
import { getUserStudentsAction } from "../../../actions";
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

  const queryClient = useQueryClient();
  const user = useCurrentUser();
  const addStudent = useHubFormStore((state) => state.addStudent);
  const removeStudent = useHubFormStore((state) => state.removeStudent);
  const students = useHubFormStore((state) => state.students);
  const nextStep = useHubFormStore((state) => state.nextStep);
  const prevStep = useHubFormStore((state) => state.prevStep);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: existingStudents, isFetching } = useQuery({
    queryKey: ["user-students", user.id],
    queryFn: async () => {
      const res = await getUserStudentsAction();
      return res?.data?.map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        image: student.image,
        isSelected: false,
      }));
    },
  });

  const onStudentSelectionChange = (key: string) => {
    const isAlreadyAdded = students.some(
      (student) => student.id === Number(key),
    );

    if (isAlreadyAdded) {
      removeStudent(Number(key));
      queryClient.setQueryData<SelectStudent[]>(
        ["user-students", user.id],
        (old) => {
          return old?.map((student) => {
            if (student.id === Number(key)) {
              return { ...student, isSelected: false };
            }
            return student;
          });
        },
      );
    } else {
      const selectedStudent = existingStudents?.find(
        (student) => student.id === Number(key),
      );
      if (selectedStudent) {
        addStudent(selectedStudent);
        queryClient.setQueryData<SelectStudent[]>(
          ["user-students", user.id],
          (old) => {
            return old?.map((student) => {
              if (student.id === Number(key)) {
                return { ...student, isSelected: true };
              }
              return student;
            });
          },
        );
      }
    }
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
              <ComboBox.Input
                className={{
                  fieldGroup: "h-10 sm:h-12 bg-overlay-highlight",
                }}
              />
              {isFetching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin">
                  <Loader />
                </div>
              )}
              <ComboBox.List
                renderEmptyState={() => (
                  <div className="flex flex-col items-center p-6 gap-0.5">
                    <p className="text-lg font-medium">No students found</p>
                    <p className="text-sm text-muted-fg">
                      You can search by name or email
                    </p>
                  </div>
                )}
                items={existingStudents}
                className={{
                  popoverContent:
                    "bg-overlay-highlight w-[calc(var(--trigger-width))]",
                }}
                showArrow={false}
              >
                {(item) => {
                  return (
                    <ComboBox.Option
                      id={item.id}
                      textValue={item.name}
                      className={"flex gap-3"}
                    >
                      <StudentProfile
                        name={item.name}
                        email={item.email}
                        image={item.image}
                        isSelected={item.isSelected}
                      />
                    </ComboBox.Option>
                  );
                }}
              </ComboBox.List>
            </ComboBox>
          </div>
          <Button
            shape="square"
            className="shrink-0 h-10 w-10 sm:w-fit sm:h-12"
            onPress={() => setIsCreateModalOpen(true)}
          >
            <HugeiconsIcon icon={UserAdd01Icon} size={16} data-slot="icon" />
            <span className="hidden sm:block">New Student</span>
          </Button>
        </div>

        <SelectedStudentsTable />

        <div className="mb-0! h-30 w-full block sm:hidden" aria-hidden="true" />

        <div
          className={cn(
            "flex flex-col-reverse fixed bottom-0 border-t left-0 bg-overlay p-4 w-full gap-2 ",
            "sm:relative sm:p-0 sm:flex-row sm:justify-end sm:border-none",
          )}
        >
          <Button
            intent="outline"
            size={isMobile ? "small" : "medium"}
            onPress={prevStep}
            shape="square"
          >
            Back
          </Button>
          <Button
            size={isMobile ? "small" : "medium"}
            onPress={nextStep}
            shape="square"
            className="px-6"
          >
            Continue
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
