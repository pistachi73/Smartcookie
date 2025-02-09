import {
  Button,
  Modal,
  Popover,
  type PopoverContentProps,
} from "@/components/ui/new/ui";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { GroupedCalendarOccurrence } from "@/lib/group-overlapping-occurrences";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import {
  ArrowRight02Icon,
  Clock01Icon,
  File02Icon,
  UserGroupIcon,
} from "@hugeicons/react";
import { format } from "date-fns";
import { Separator } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { CALENDAR_EVENT_COLORS_MAP, DEFAULT_EVENT_COLOR } from "../utils";
import { DeleteEventModalContent } from "./delete-event-modal-content";

const useEventOccurrencePopover = () =>
  useCalendarStore(
    useShallow((store) => ({
      openEditEventOccurrence: store.openEditEventOccurrence,
    })),
  );

type EventOccurrencePopoverProps = {
  occurrence: GroupedCalendarOccurrence;
  onEditPress?: () => void;
  popoverProps?: Omit<PopoverContentProps, "children">;
};

export const EventOccurrencePopover = ({
  occurrence,
  onEditPress,
  popoverProps,
}: EventOccurrencePopoverProps) => {
  const { openEditEventOccurrence } = useEventOccurrencePopover();
  const { className: popoverClassName, ...restPopoverProps } =
    popoverProps ?? {};

  const color =
    CALENDAR_EVENT_COLORS_MAP.get(occurrence.color) ??
    CALENDAR_EVENT_COLORS_MAP.get(DEFAULT_EVENT_COLOR);
  return (
    <Popover.Content
      className={cn("sm:w-[300px]", popoverClassName)}
      {...restPopoverProps}
    >
      <Popover.Header className="space-y-2">
        <Popover.Title className="text-lg flex items-center gap-2">
          <div className="w-5 flex items-center justify-center">
            <div
              className={cn("size-3 rounded-full border", color?.className)}
            />
          </div>
          {occurrence.title}
        </Popover.Title>
        <div className="text-sm flex items-start gap-2">
          <div className="w-5 flex items-center justify-center h-5">
            <Clock01Icon size={16} />
          </div>

          <div className="space-y-0.5">
            <p> {format(occurrence.startTime, "EEEE, dd LLLL y")}</p>
            <div className="text-sm flex items-center gap-1.5">
              <p className=" text-text-sub">
                {format(occurrence.startTime, "HH:mm")}
              </p>
              <ArrowRight02Icon
                color="var(--color-text-sub)"
                size={16}
                variant="solid"
              />
              <p className="text-text-sub">
                {format(occurrence.endTime, "HH:mm")}
              </p>
            </div>
          </div>
        </div>
      </Popover.Header>
      <Popover.Body className="space-y-3">
        {occurrence.description && (
          <>
            <Separator className="bg-border/20" />
            <div className="text-sm flex items-start gap-2">
              <div className="w-5 flex items-center justify-center h-5">
                <File02Icon size={16} />
              </div>
              <p className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                ullamcorper, nisl in commodo egestas, sem eros blandit nisi.
              </p>
            </div>
          </>
        )}

        <Separator className="bg-border/20" />
        <div className="text-sm flex items-start gap-2">
          <div className="w-5 flex items-center justify-center h-5">
            <UserGroupIcon size={16} />
          </div>
          <div className="space-y-2 w-full">
            <p className="text-sm">Participants (2)</p>
            <div className="flex flex-row items-center not-last:-ml-4">
              <UserAvatar
                userImage={"https://i.pravatar.cc/150?img=1"}
                userName={"Oscar Pulido"}
                size="sm"
                className="size-9"
              />
              <UserAvatar
                userImage={"https://i.pravatar.cc/150?img=1"}
                userName={"Oscar Pulido"}
                size="sm"
                className="size-9"
              />
            </div>
          </div>
        </div>
      </Popover.Body>
      <Popover.Footer className="flex items-center justify-end gap-2">
        <Modal>
          <Button appearance="plain" size="small">
            Delete
          </Button>
          <DeleteEventModalContent />
        </Modal>
        <Button
          size="small"
          className="px-4"
          slot="close"
          onPress={() => {
            onEditPress?.();
            openEditEventOccurrence(occurrence.eventOccurrenceId);
          }}
        >
          Edit
        </Button>
      </Popover.Footer>
    </Popover.Content>
  );
};
