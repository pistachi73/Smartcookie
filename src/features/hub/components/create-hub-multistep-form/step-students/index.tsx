"use client";

import { Button } from "@/shared/components/ui/button";
import { ComboBox } from "@/shared/components/ui/combo-box";
import { Loader } from "@/shared/components/ui/loader";
import { PhoneField } from "@/shared/components/ui/phone-field";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { cn } from "@/shared/lib/classes";
import { Search01Icon, UserAdd01Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { getUserStudentsAction } from "../../../actions";
import { useHubFormStore } from "../../../store/hub-form-store";
import { SelectedStudentsTable } from "./selected-students-table";
import { StudentProfile } from "./student-profile";

export type SelectStudent = {
  id: number;
  name: string;
  email: string;
  image: string | null;
  isSelected: boolean;
};

export function StepStudents() {
  const queryClient = useQueryClient();
  const user = useCurrentUser();
  const addStudent = useHubFormStore((state) => state.addStudent);
  const removeStudent = useHubFormStore((state) => state.removeStudent);
  const students = useHubFormStore((state) => state.students);

  const comboBoxRef = useRef<HTMLDivElement>(null);

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

  const triggerWidth = comboBoxRef.current?.getBoundingClientRect().width;

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

  console.log({ existingStudents });
  const [phone, setPhone] = useState("");

  return (
    <div className="w-full space-y-6">
      <PhoneField value={phone} onChange={setPhone} label="Phone Number" />
      <div ref={comboBoxRef} className={cn("w-full flex items-center gap-2 ")}>
        <div className="relative flex-1">
          <ComboBox
            placeholder="Search existing student..."
            menuTrigger="focus"
            selectedKey={null}
            allowsEmptyCollection={true}
            onSelectionChange={(key) => onStudentSelectionChange(key as string)}
          >
            <ComboBox.Input
              prefix={
                <HugeiconsIcon icon={Search01Icon} size={14} data-slot="icon" />
              }
              className={{
                fieldGroup: "h-12 pl-4 bg-overlay-highlight",
              }}
            />
            {isFetching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin">
                <Loader />
              </div>
            )}
            <ComboBox.List
              renderEmptyState={() => (
                <div className="w-[var(--trigger-width)] flex flex-col items-center p-6 gap-0.5">
                  <p className="text-lg font-medium">No students found</p>
                  <p className="text-sm text-muted-fg">
                    You can search by name or email
                  </p>
                </div>
              )}
              items={existingStudents}
              triggerRef={comboBoxRef}
              style={{
                width: `${triggerWidth}px`,
              }}
              className={{
                popoverContent: "bg-overlay-highlight",
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
        <Button shape="square" className="shrink-0">
          <HugeiconsIcon icon={UserAdd01Icon} size={16} data-slot="icon" />
          New Student
        </Button>
      </div>

      <SelectedStudentsTable />
    </div>
  );
}
