"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  CalendarCheckOut02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format, isToday, isTomorrow } from "date-fns";

import { AvatarStack } from "@/shared/components/ui/avatar-stack";
import { Card } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { Separator } from "@/shared/components/ui/separator";
import { StudentProfile } from "@/shared/components/students/student-profile";
import { cn } from "@/shared/lib/classes";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";

import { getNextSessionQueryOptions } from "../../lib/get-next-session-query-options";
import { GoToCourseLink } from "./go-to-course-button";
import { NextSessionUnavailable } from "./next-session-unavailab";

export const NextSession = () => {
  const { data: nextSession } = useSuspenseQuery(getNextSessionQueryOptions());

  if (!nextSession) {
    return <NextSessionUnavailable />;
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
    <Card className="shrink-0 flex flex-col h-full bg-overlay @container">
      <Card.Header className="flex flex-row items-center justify-between">
        <Card.Title className="flex gap-2 @2xl:gap-4  flex-col @2xl:items-center  @2xl:flex-row">
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={CalendarCheckOut02Icon} size={18} />
            Upcoming Session
          </span>
          <Separator
            orientation="vertical"
            className="h-4 hidden @2xl:block "
          />
          <div className="flex items-start gap-2 text-sm @2xl:text-lg">
            <div className="flex gap-4 items-center">
              <span>{label}</span>
              <div className="font-medium text-muted-fg flex items-center gap-1.5 tabular-nums">
                <span>{format(nextSession.startTime, "HH:mm")}</span>
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  color="var(--color-muted-fg)"
                  size={16}
                />
                <p>{format(nextSession.endTime, "HH:mm")}</p>
              </div>
            </div>
          </div>
        </Card.Title>

        <Card.Action>
          <GoToCourseLink hubId={hub?.id} />
        </Card.Action>
      </Card.Header>

      <Card.Content className="grid grid-cols-1 @2xl:grid-cols-[1fr_2fr] gap-8">
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
                size="lg"
                users={nextSession.students ?? []}
                maxAvatars={5}
                className={{
                  avatar: "outline-overlay outline-2",
                }}
              />
            )}
          </section>
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
