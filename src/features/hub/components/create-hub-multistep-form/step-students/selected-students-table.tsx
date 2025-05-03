"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { cn } from "@/shared/lib/classes";
import {
  Delete01Icon,
  UserMultiple02Icon,
} from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryClient } from "@tanstack/react-query";
import type { SelectStudent } from ".";
import { useHubFormStore } from "../../../store/hub-form-store";
import { StudentProfile } from "./student-profile";
export const SelectedStudentsTable = () => {
  const user = useCurrentUser();
  const students = useHubFormStore((state) => state.students);
  const removeStudent = useHubFormStore((state) => state.removeStudent);
  const queryClient = useQueryClient();

  const onStudentRemove = (id: number) => {
    removeStudent(id);
    queryClient.setQueryData<SelectStudent[]>(
      ["user-students", user.id],
      (old) => {
        return old?.map((student) => {
          if (student.id === id) {
            return { ...student, isSelected: false };
          }
          return student;
        });
      },
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4 bg-overlay-highlight border-b">
        <Heading level={3}>Students</Heading>
        <Badge intent="secondary" className="flex items-center gap-1 py-1 px-2">
          <HugeiconsIcon icon={UserMultiple02Icon} size={16} />
          {students.length}
        </Badge>
      </div>
      <div className={cn("p-4 h-[260px] overflow-y-auto")}>
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full w-full gap-2">
            <HugeiconsIcon icon={UserMultiple02Icon} size={28} />
            <p className="max-w-[20ch] text-center text-muted-fg flex items-center justify-center">
              Add students to your hub by searching above
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {students.map(({ image, email, name, id }) => (
              <div key={id} className="flex justify-between">
                <StudentProfile
                  name={name}
                  email={email}
                  image={image ?? null}
                />
                <Button
                  size="square-petite"
                  intent="plain"
                  shape="square"
                  onPress={() => onStudentRemove(id)}
                >
                  <HugeiconsIcon icon={Delete01Icon} size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
