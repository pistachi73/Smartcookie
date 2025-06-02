"use client";

import { StudentProfile } from "@/shared/components/students/student-profile";
import { AvatarStack } from "@/shared/components/ui/avatar-stack";
import { buttonStyles } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";
import {
  ArrowRight02Icon,
  CalendarCheckOut02Icon,
  LinkSquare02Icon,
} from "@hugeicons-pro/core-stroke-rounded";

import { Card } from "@/shared/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { format, isToday, isTomorrow } from "date-fns";
import { useGetNextSession } from "../../hooks/use-get-next-session";

export const NextSession = () => {
  const { data: nextSession } = useGetNextSession();

  if (!nextSession) {
    return null;
  }

  const colorClasses = getCustomColorClasses(
    nextSession.hub?.color ?? "neutral",
  );

  const hub = nextSession.hub;
  const sessionNotes = nextSession.notes;

  const label = isToday(new Date(nextSession.startTime))
    ? "Today"
    : isTomorrow(new Date(nextSession.startTime))
      ? "Tomorrow"
      : format(new Date(nextSession.startTime), "EEEE, dd MMMM");

  return (
    <Card className="shrink-0 flex flex-col h-full bg-overlay">
      <Card.Header className="flex flex-row items-center justify-between">
        <div className="flex gap-4 items-center">
          <Heading
            level={4}
            className="text-base font-semibold flex items-center gap-1.5"
          >
            <HugeiconsIcon icon={CalendarCheckOut02Icon} size={18} />
            Upcoming Session
          </Heading>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-start gap-2">
            {/* <div className="h-6 flex items-center justify-center">
              <HugeiconsIcon icon={Clock01Icon} size={16} />
            </div> */}

            <div className="flex gap-4 items-center">
              <p className="text-base font-medium">{label}</p>
              <div className="font-medium text-muted-fg flex items-center gap-1.5 tabular-nums">
                <p>{format(nextSession.startTime, "HH:mm")}</p>
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  color="var(--color-muted-fg)"
                  size={16}
                />
                <p>{format(nextSession.endTime, "HH:mm")}</p>
              </div>
            </div>
          </div>
        </div>

        <Link
          href={`/portal/hubs/${hub?.id}`}
          className={buttonStyles({
            intent: "outline",
            size: "extra-small",
          })}
        >
          Go to course
          <HugeiconsIcon icon={LinkSquare02Icon} data-slot="icon" size={14} />
        </Link>
      </Card.Header>

      <Card.Content className="grid grid-cols-[1fr_2fr] gap-8">
        <div className="space-y-4 min-w-0">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "size-3 rounded-full border shrink-0",
                colorClasses?.bg,
                colorClasses?.border,
              )}
            />
            <Heading level={2} className="truncate">
              {hub?.name}
            </Heading>
          </div>

          <section className="flex flex-col gap-3">
            {!nextSession.students.length ? (
              <p className="text-sm text-muted-fg italic">
                No students for this session
              </p>
            ) : nextSession.students.length <= 2 ? (
              nextSession.students.map((student) => (
                <StudentProfile
                  key={student.id}
                  name={student.name}
                  email={student.email}
                  image={student.image}
                />
              ))
            ) : (
              <AvatarStack
                size="large"
                users={nextSession.students ?? []}
                maxAvatars={5}
                className={{
                  avatar: "outline-overlay outline-2",
                }}
              />
            )}
            {/* <AvatarStack
              size="large"
              users={nextSession.students ?? []}
              className={{
                avatar: "outline-overlay outline-2",
              }}
            /> */}
          </section>
          {/* <section className="space-y-3">
            
            {nextSession.students.map((student) => (
              <StudentProfile
                key={student.id}
                name={student.name}
                email={student.email}
                image={student.image}
              />
            ))}
            <AvatarStack
              size="medium"
              users={nextSession.students ?? []}
              className={{
                avatar: "outline-overlay",
              }}
            />
          </section> */}
        </div>
        <div className="shrink-0 flex flex-col gap-4">
          {/* <p className="text-xs font-medium text-muted-fg uppercase">
            Session notes
          </p> */}
          <div className="flex flex-col gap-2 h-full">
            {sessionNotes?.length ? (
              sessionNotes?.map((note) => (
                <div
                  key={`session-note-${note.id}`}
                  className="dark:bg-overlay-highlight p-3 rounded-lg bg-bg"
                >
                  <p className="text-sm line-clamp-3">{note.content}</p>
                </div>
              ))
            ) : (
              <div className="dark:bg-overlay-highlight p-3 rounded-lg bg-bg">
                <p className="text-sm text-muted-fg italic">
                  No notes for this session
                </p>
              </div>
            )}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
