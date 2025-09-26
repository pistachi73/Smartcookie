"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Archive02Icon,
  ArrowLeft02Icon,
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
import { Card } from "@/shared/components/ui/card";
import { Link } from "@/shared/components/ui/link";
import { UserAvatar } from "@/shared/components/ui/user-avatar";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";
import { cn } from "@/shared/lib/utils";

import type { UpdateStudentSchema } from "@/data-access/students/schemas";
import { useUpdateStudent } from "../../hooks/use-update-student";
import { getUserStudentByIdQueryOptions } from "../../lib/user-students-query-options";
import { EditableDateField } from "./editable-field/editable-date-field";
import { EditablePhoneField } from "./editable-field/editable-phone-field";
import { EditableTextField } from "./editable-field/editable-text-field";
import { StudentNotFound } from "./student-not-found";
import { StudentProfileLayout } from "./student-profile-layout";

type UpdatableStudentFields = keyof Omit<
  z.infer<typeof UpdateStudentSchema>,
  "id"
>;

export const StudentProfileDetail = ({ id }: { id: number }) => {
  const { mutate: updateStudent } = useUpdateStudent();
  const { data: student } = useSuspenseQuery(
    getUserStudentByIdQueryOptions(id),
  );

  if (!student) return <StudentNotFound />;

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

  const isViewOnly = student.status !== "active";
  return (
    <StudentProfileLayout>
      <div className="grid grid-cols-1 @6xl:grid-cols-3 gap-6 overflow-y-auto">
        <div className="@6xl:col-span-2 space-y-6">
          <Card className="relative @container">
            <Card.Header className="flex flex-col gap-6 ">
              <Link
                href={"/portal/students"}
                intent="primary"
                className="flex items-center gap-2 text-sm text-muted-fg"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
                Back to students
              </Link>
              <div className="flex items-center gap-3">
                <UserAvatar
                  userImage={student.image}
                  userName={student.name}
                  size="xl"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-fg">
                      {student.name}
                    </h2>
                    <Badge
                      intent={
                        student.status === "active" ? "success" : "secondary"
                      }
                    >
                      {student.status === "inactive" && (
                        <HugeiconsIcon icon={Archive02Icon} size={16} />
                      )}
                      {student.status === "active" ? "Active" : "Archived"}
                    </Badge>
                  </div>
                  {studentAge && student.nationality && (
                    <p className="text-muted-fg">
                      Age {studentAge} - {student.nationality}
                    </p>
                  )}
                </div>
              </div>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4 ">
                <EditableTextField
                  label="Name"
                  isRequired
                  icon={User02Icon}
                  value={student.name ?? undefined}
                  onSave={(value) => handleFieldSave("name", value)}
                  placeholder="Enter student name..."
                  readOnly={isViewOnly}
                />

                <EditableTextField
                  label="Email"
                  isRequired
                  icon={Mail01Icon}
                  value={student.email ?? undefined}
                  onSave={(value) => handleFieldSave("email", value)}
                  type="email"
                  placeholder="Enter student email..."
                  readOnly={isViewOnly}
                />

                <EditablePhoneField
                  label="Phone Number"
                  icon={CallIcon}
                  value={student.phone ?? undefined}
                  onSave={(value) => handleFieldSave("phone", value)}
                  type="tel"
                  placeholder="Enter student phone..."
                  readOnly={isViewOnly}
                />

                <EditableTextField
                  label="Location"
                  icon={Location01Icon}
                  value={student.location ?? undefined}
                  onSave={(value) => handleFieldSave("location", value)}
                  placeholder="Enter student location..."
                  readOnly={isViewOnly}
                />

                <EditableTextField
                  label="Native Language(s)"
                  icon={Flag01Icon}
                  value={student.motherLanguage ?? undefined}
                  onSave={(value) => handleFieldSave("motherLanguage", value)}
                  placeholder="Enter student nationality..."
                  readOnly={isViewOnly}
                />
                <EditableTextField
                  label="Nationality"
                  icon={Flag01Icon}
                  value={student.nationality ?? undefined}
                  onSave={(value) => handleFieldSave("nationality", value)}
                  placeholder="Enter student nationality..."
                  readOnly={isViewOnly}
                />

                {/* <EditableTextField
                  label="Job"
                  value={student.job ?? undefined}
                  onSave={(value) => handleFieldSave("job", value)}
                  placeholder="Enter student job..."
                  icon={Briefcase01Icon}
                  readOnly={isViewOnly}
                /> */}

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
                  readOnly={isViewOnly}
                />

                <EditableTextField
                  label="Learning Language"
                  icon={EarthIcon}
                  value={student.learningLanguage ?? undefined}
                  onSave={(value) => handleFieldSave("learningLanguage", value)}
                  placeholder="Enter student learning language..."
                  readOnly={isViewOnly}
                />
              </div>

              <EditableTextField
                label="Interests, hobbies, other languages, etc."
                value={student.interests ?? undefined}
                onSave={(value) => handleFieldSave("interests", value)}
                type="textarea"
                readOnly={isViewOnly}
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
