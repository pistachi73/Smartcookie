import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  Clock01Icon,
  UserGroupIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { format } from "date-fns";
import { useState } from "react";
import { Separator } from "react-aria-components";

import { AvatarStack } from "@/shared/components/ui/avatar-stack";
import { Button } from "@/ui/button";
import { Modal } from "@/ui/modal";
import { Popover, type PopoverContentProps } from "@/ui/popover";
import { cn } from "@/shared/lib/classes";

import { getCalendarColor } from "@/features/calendar/lib/utils";
import type { CalendarSession } from "@/features/calendar/types/calendar.types";
import { UpdateSessionFormModal } from "@/features/hub/components/session/update-session-form-modal";
import { DeleteEventModalContent } from "./delete-event-modal-content";

type SessionPopoverProps = {
  session: CalendarSession;
  onEditPress?: () => void;
  popoverProps?: Omit<PopoverContentProps, "children">;
};

export const SessionPopover = ({
  session,
  onEditPress,
  popoverProps,
}: SessionPopoverProps) => {
  const [isUpdateSessionModalOpen, setIsUpdateSessionModalOpen] =
    useState(false);
  const { className: popoverClassName, ...restPopoverProps } =
    popoverProps ?? {};

  const color = getCalendarColor(session.hub?.color);

  // Convert CalendarSession to HubSession format for UpdateSessionFormModal
  const hubSession = {
    id: session.id,
    startTime: session.startTime,
    endTime: session.endTime,
    status: "upcoming" as const, // Default status since CalendarSession doesn't have this
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
        className={cn("sm:w-[300px]", popoverClassName)}
        {...restPopoverProps}
      >
        <Popover.Header className="space-y-2">
          <Popover.Title className="flex items-center gap-2">
            <div className="w-5 flex items-center justify-center">
              <div
                className={cn("size-3 rounded-full border", color?.className)}
              />
            </div>
            {session.hub?.name}
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
        <Popover.Body className="space-y-3">
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
                  size="medium"
                  users={session.students}
                  maxAvatars={3}
                  className={{ avatar: "outline-overlay outline-2" }}
                />
              </div>
            </div>
          </div>
        </Popover.Body>
        <Popover.Footer className="flex items-center justify-end gap-2">
          <Modal>
            <Button intent="plain" size="small">
              Delete
            </Button>
            <DeleteEventModalContent />
          </Modal>
          <Button
            size="small"
            className="px-4"
            slot="close"
            onPress={() => {
              setIsUpdateSessionModalOpen(true);
            }}
          >
            Edit
          </Button>
        </Popover.Footer>
      </Popover.Content>
      <UpdateSessionFormModal
        session={hubSession}
        hubId={session.hub.id}
        isOpen={isUpdateSessionModalOpen}
        setIsOpen={setIsUpdateSessionModalOpen}
      />
    </>
  );
};
