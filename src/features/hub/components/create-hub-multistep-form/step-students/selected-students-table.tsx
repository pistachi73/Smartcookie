"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { UserMultiple02Icon } from "@hugeicons-pro/core-solid-rounded";
import { Delete02Icon } from "@hugeicons-pro/core-stroke-rounded";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Heading } from "@/ui/heading";
import { StudentProfile } from "@/shared/components/students/student-profile";
import { cn } from "@/shared/lib/classes";

import { useHubFormStore } from "../../../store/hub-form-store";

export const SelectedStudentsTable = () => {
  const students = useHubFormStore((state) => state.students);
  const removeStudent = useHubFormStore((state) => state.removeStudent);

  const onStudentRemove = (id: number) => {
    removeStudent(id);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4 bg-muted border-b">
        <Heading level={3} className="sm:text-base">
          Enrolled Students
        </Heading>
        <Badge
          intent="secondary"
          className="flex items-center gap-1 py-1 px-2 tabular-nums"
        >
          <HugeiconsIcon icon={UserMultiple02Icon} size={16} />
          {students.length}
        </Badge>
      </div>
      <div className={cn("h-[350px] overflow-y-auto")}>
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full w-full ">
            <p className="max-w-[20ch] text-center text-muted-fg flex items-center justify-center italic">
              Add students to your hub by searching above
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {students.map(({ image, email, name, id }) => (
              <div
                key={id}
                className="flex items-center justify-between hover:bg-muted/70 p-3 px-4"
              >
                <StudentProfile
                  name={name}
                  email={email}
                  image={image ?? null}
                />
                <Button
                  size="sq-sm"
                  intent="danger"
                  className="text-danger hover:bg-danger/10 bg-transparent"
                  onPress={() => onStudentRemove(id)}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
