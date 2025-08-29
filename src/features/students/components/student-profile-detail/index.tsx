"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  Briefcase01Icon,
  Calendar01Icon,
  CallIcon,
  EarthIcon,
  Flag01Icon,
  LinkSquare02Icon,
  Location01Icon,
  Mail01Icon,
  User02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { z } from "zod";

import { Badge } from "@/shared/components/ui/badge";
import { buttonStyles } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Link } from "@/shared/components/ui/link";
import { UserAvatar } from "@/shared/components/ui/user-avatar";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";
import { cn } from "@/shared/lib/utils";

import type { UpdateStudentSchema } from "@/data-access/students/schemas";
import { useUpdateStudent } from "../../hooks/use-update-student";
import { getUserStudentByIdQueryOptions } from "../../lib/user-students-query-options";
import {
  EditableDateField,
  EditablePhoneField,
  EditableTextField,
} from "./editable-field";
import { StudentProfileLayout } from "./student-profile-layout";

type UpdatableStudentFields = keyof Omit<
  z.infer<typeof UpdateStudentSchema>,
  "id"
>;

export const StudentProfileDetail = ({ id }: { id: number }) => {
  const { mutate: updateStudent } = useUpdateStudent();
  const { data: student, isLoading } = useSuspenseQuery(
    getUserStudentByIdQueryOptions(id),
  );

  if (isLoading) return <div>hello</div>;

  if (!student)
    return (
      <StudentProfileLayout
        isLoading={false}
        studentId={0}
        studentName="Not found"
      >
        <EmptyState
          title="Student not found"
          description="The student you are looking for does not exist."
          className="bg-white"
          icon={User02Icon}
          action={
            <Link
              href="/portal/students"
              className={cn(buttonStyles({ intent: "secondary" }))}
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} data-slot="icon" />
              Back to students
            </Link>
          }
        />
      </StudentProfileLayout>
    );

  const handleFieldSave = (field: UpdatableStudentFields, value?: string) => {
    if (!value) return;
    updateStudent({
      id,
      [field]: value,
    });
  };

  const birthDate = student.birthDate ? new Date(student.birthDate) : null;
  const studentAge = birthDate
    ? today(getLocalTimeZone()).year - birthDate.getFullYear()
    : null;

  return (
    <StudentProfileLayout
      studentId={id}
      studentName={student.name}
      isLoading={false}
    >
      <div className="grid grid-cols-1 @6xl:grid-cols-3 gap-6">
        <div className="@6xl:col-span-2 space-y-6">
          <Card className="relative @container">
            <Card.Header className="flex items-center gap-4 justify-between ">
              <div className="flex items-center gap-4">
                <UserAvatar
                  userImage={student.image}
                  userName={student.name}
                  size="xl"
                />

                <div>
                  <h2 className="text-xl font-semibold text-fg">
                    {student.name}
                  </h2>
                  <p className="text-muted-fg">
                    Age {studentAge} - {student.nationality}
                  </p>
                </div>
              </div>

              <Badge
                intent={student.status === "active" ? "success" : "danger"}
                className="absolute top-4 right-4"
              >
                {student.status}
              </Badge>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4 ">
                <EditableTextField
                  label="Full Name"
                  isRequired
                  icon={User02Icon}
                  value={student.name ?? undefined}
                  onSave={(value) => handleFieldSave("name", value)}
                  placeholder="Enter student name..."
                />

                <EditableTextField
                  label="Email Address"
                  isRequired
                  icon={Mail01Icon}
                  value={student.email ?? undefined}
                  onSave={(value) => handleFieldSave("email", value)}
                  type="email"
                  placeholder="Enter student email..."
                />

                <EditablePhoneField
                  label="Phone Number"
                  icon={CallIcon}
                  value={student.phone ?? undefined}
                  onSave={(value) => handleFieldSave("phone", value)}
                  type="tel"
                  placeholder="Enter student phone..."
                />

                <EditableTextField
                  label="Location"
                  icon={Location01Icon}
                  value={student.location ?? undefined}
                  onSave={(value) => handleFieldSave("location", value)}
                  placeholder="Enter student location..."
                />

                <EditableTextField
                  label="Nationality"
                  icon={Flag01Icon}
                  value={student.nationality ?? undefined}
                  onSave={(value) => handleFieldSave("nationality", value)}
                  placeholder="Enter student nationality..."
                />

                <EditableTextField
                  label="Job"
                  value={student.job ?? undefined}
                  onSave={(value) => handleFieldSave("job", value)}
                  placeholder="Enter student job..."
                  icon={Briefcase01Icon}
                />

                <EditableDateField
                  label="Birth Date"
                  icon={Calendar01Icon}
                  value={
                    birthDate
                      ? new CalendarDate(
                          birthDate.getFullYear(),
                          birthDate.getMonth() - 1,
                          birthDate.getDate(),
                        )
                      : undefined
                  }
                  onSave={(value) => {
                    const date = value?.toDate(getLocalTimeZone());
                    if (!date) return;
                    handleFieldSave("birthDate", date.toISOString());
                  }}
                  placeholder="Enter student birth date..."
                />

                <EditableTextField
                  label="Learning Language"
                  icon={EarthIcon}
                  value={student.learningLanguage ?? undefined}
                  onSave={(value) => handleFieldSave("learningLanguage", value)}
                  placeholder="Enter student learning language..."
                />
              </div>

              <EditableTextField
                label="Interests & Hobbies"
                value={student.interests ?? undefined}
                onSave={(value) => handleFieldSave("interests", value)}
                type="textarea"
              />
            </Card.Content>
          </Card>
        </div>

        <Card>
          <Card.Header
            title="Enrolled Courses"
            description="The courses the student is enrolled in."
          />
          <Card.Content className="space-y-4">
            {student.hubs.map((hub) => {
              const color = getCustomColorClasses(hub.color);

              return (
                <Link
                  intent="unstyled"
                  href={`/portal/hubs/${hub.id}`}
                  key={`hub-${hub.id}`}
                  className="bg-muted group relative w-full block rounded-md p-4 transition-colors border space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "size-3 rounded-full border",
                        color.bg,
                        color.border,
                      )}
                    />
                    <span className="font-medium ">{hub.name}</span>
                    <Badge
                      intent={hub.status === "active" ? "success" : "danger"}
                    >
                      {hub.status}
                    </Badge>
                  </div>
                  <p className="ml-5 text-fg/70 text-sm text-pretty">
                    {hub.description}
                  </p>
                  <HugeiconsIcon
                    icon={LinkSquare02Icon}
                    size={18}
                    className="absolute opacity-0 group-hover:opacity-100 transition-opacity right-2 top-2"
                  />
                </Link>
              );
            })}
          </Card.Content>
        </Card>
      </div>
    </StudentProfileLayout>
  );
};
