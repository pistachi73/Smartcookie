import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  Clock01Icon,
  Delete01Icon,
  Pen01Icon,
  UserGroupIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Separator } from "react-aria-components";

import { AvatarStack } from "@/shared/components/ui/avatar-stack";
import { Dialog } from "@/shared/components/ui/dialog";
import { Link } from "@/ui/link";
import { Popover, type PopoverContentProps } from "@/ui/popover";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { cn } from "@/shared/lib/classes";

import { getCalendarColor } from "@/features/calendar/lib/utils";
import type { CalendarSession } from "@/features/calendar/types/calendar.types";

const DynamicUpdateSessionFormModal = dynamic(
  () =>
    import("@/features/hub/components/session/update-session-form-modal").then(
      (mod) => mod.UpdateSessionFormModal,
    ),
  {
    ssr: false,
  },
);

const DynamicDeleteEventModalContent = dynamic(
  () =>
    import("./delete-event-modal-content").then(
      (mod) => mod.DeleteEventModalContent,
    ),
  {
    ssr: false,
  },
);

type SessionPopoverProps = {
  session: CalendarSession;
  popoverProps?: Omit<PopoverContentProps, "children">;
};

export const SessionPopover = ({
  session,
  popoverProps,
}: SessionPopoverProps) => {
  const [isUpdateSessionModalOpen, setIsUpdateSessionModalOpen] =
    useState(false);
  const [isDeleteSessionModalOpen, setIsDeleteSessionModalOpen] =
    useState(false);
  const { className: popoverClassName, ...restPopoverProps } =
    popoverProps ?? {};

  const color = getCalendarColor(session.hub?.color);
  const { down } = useViewport();
  const isMobile = down("sm");

  // Convert CalendarSession to HubSession format for UpdateSessionFormModal
  const hubSession = {
    id: session.id,
    startTime: session.startTime,
    endTime: session.endTime,
    status: session.status,
    duration: {
      hours: Math.floor(
        (new Date(session.endTime).getTime() -
          new Date(session.startTime).getTime()) /
          (1000 * 60 * 60),
      ),
      minutes: Math.floor(
        ((new Date(session.endTime).getTime() -
          new Date(session.startTime).getTime()) %
          (1000 * 60 * 60)) /
          (1000 * 60),
      ),
      totalMinutes: Math.floor(
        (new Date(session.endTime).getTime() -
          new Date(session.startTime).getTime()) /
          (1000 * 60),
      ),
    },
  };

  return (
    <>
      <Popover.Content
        className={cn("sm:w-[300px]  shadow-lg", popoverClassName)}
        showArrow={true}
        {...restPopoverProps}
      >
        <Dialog className="[--gutter:--spacing(4)] sm:[--gutter:--spacing(6)]">
          <Popover.Header className="space-y-2">
            <Popover.Title className="flex items-center gap-2" level={1}>
              <div className="w-5 flex items-center justify-center">
                <div
                  className={cn("size-3 rounded-full border", color?.className)}
                />
              </div>
              {session.hub ? (
                <Link
                  href={`/portal/hubs/${session.hub.id}`}
                  className="flex items-center gap-2"
                  intent="primary"
                >
                  {session.hub.name}
                </Link>
              ) : (
                "Untitled"
              )}
            </Popover.Title>
            <div className="text-sm flex items-start gap-2">
              <div className="w-5 flex items-center justify-center h-5">
                <HugeiconsIcon icon={Clock01Icon} size={16} />
              </div>

              <div className="space-y-0.5">
                <p>{format(session.startTime, "EEEE, dd MMMM yyyy")}</p>
                <div className="text-sm flex items-center gap-1.5">
                  <p className=" text-text-sub">
                    {format(session.startTime, "HH:mm")}
                  </p>
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    color="var(--color-text-sub)"
                    size={16}
                  />
                  <p className="text-text-sub">
                    {format(session.endTime, "HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          </Popover.Header>
          <Popover.Body className="space-y-4">
            <Separator className="bg-border/20" />
            <div className="text-sm flex items-start gap-2">
              <div className="w-5 flex items-center justify-center h-5">
                <HugeiconsIcon icon={UserGroupIcon} size={16} />
              </div>
              <div className="space-y-2 w-full">
                <p className="text-sm">
                  Participants ({session.students.length})
                </p>
                <div className="flex flex-row items-center not-last:-ml-4">
                  <AvatarStack
                    keyPrefix={`session${session.id}-popover`}
                    size="md"
                    users={session.students}
                    maxAvatars={3}
                    className={{ avatar: "outline-overlay outline-2" }}
                  />
                </div>
              </div>
            </div>
          </Popover.Body>
          <Popover.Footer className="flex items-center flex-row justify-start gap-2 ml-6">
            <Popover.Close
              intent="outline"
              size="sm"
              onPress={() => {
                setIsDeleteSessionModalOpen(true);
              }}
            >
              <HugeiconsIcon
                icon={Delete01Icon}
                size={16}
                className="text-danger"
              />
              Delete
            </Popover.Close>
            <Popover.Close
              size="sm"
              intent="outline"
              className="px-4"
              onPress={() => {
                setIsUpdateSessionModalOpen(true);
              }}
              {...(!isMobile && {
                slot: "close",
              })}
            >
              <HugeiconsIcon icon={Pen01Icon} size={16} />
              Edit
            </Popover.Close>
          </Popover.Footer>
        </Dialog>
      </Popover.Content>

      <DynamicUpdateSessionFormModal
        session={hubSession}
        hubId={session.hub.id}
        isOpen={isUpdateSessionModalOpen}
        setIsOpen={setIsUpdateSessionModalOpen}
      />
      <DynamicDeleteEventModalContent
        isOpen={isDeleteSessionModalOpen}
        onOpenChange={setIsDeleteSessionModalOpen}
      />
    </>
  );
};
